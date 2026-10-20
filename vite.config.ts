import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function backendPlugin(): Plugin {
  return {
    name: 'backend-plugin',
    configureServer(server) {
      // 1. Content persistence
      server.middlewares.use('/api/save-content', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              const filePath = path.resolve(__dirname, 'src/data/savedContent.json')
              fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, timestamp: new Date().toISOString() }))
            } catch (err: any) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else {
          res.statusCode = 404
          res.end()
        }
      })

      // Helper: Send email notification to admin
      const sendNotificationEmail = async (inquiry: any, config: any) => {
        const recipient = config?.adminEmail || 'demicstructures@gmail.com'
        const provider = config?.provider || 'web3forms'
        const accessKey = config?.accessKey || 'b94371fa-1fbe-4db5-9e32-23c3ca1ad7f4'
        const fromName = config?.fromName || 'Demics Homes Portal'

        // Ensure TLS doesn't fail on local Windows dev environments
        try {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
        } catch {}

        const subject = `🚨 New Project Inquiry: ${inquiry.name} (${inquiry.type})`
        const textMessage = [
          `NEW PROJECT INQUIRY RECEIVED AT DEMICS HOMES PORTAL`,
          ``,
          `Client Name: ${inquiry.name}`,
          `Phone Number: ${inquiry.phone}`,
          `Project Scope: ${inquiry.type}`,
          `Site Location: ${inquiry.location || 'Not specified'}`,
          `Submitted At: ${new Date(inquiry.createdAt || Date.now()).toLocaleString()}`,
          ``,
          `Client Brief / Project Details:`,
          `${inquiry.message || 'No additional details provided.'}`,
          ``,
          `--------------------------------------------------`,
          `Review & respond to this inquiry in your Admin Portal:`,
          `http://localhost:5173/ademola/inquiries`
        ].join('\n')

        try {
          if (provider === 'web3forms') {
            const resp = await fetch('https://api.web3forms.com/submit', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
              },
              body: JSON.stringify({
                access_key: accessKey,
                subject,
                from_name: fromName,
                name: inquiry.name,
                phone: inquiry.phone,
                project_type: inquiry.type,
                location: inquiry.location || 'Not specified',
                message: textMessage,
                recipient,
                replyto: recipient
              })
            })
            const rawText = await resp.text()
            let result: any = {}
            try {
              result = JSON.parse(rawText)
            } catch {
              result = { message: rawText.slice(0, 200) }
            }

            if (result.success === true) {
              return { success: true, message: 'Notification email delivered successfully!' }
            } else {
              const msg = String(result.message || '')
              const cleanMsg = (msg.includes('<!DOCTYPE') || msg.includes('<html') || msg.includes('Just a moment'))
                ? 'Web3Forms free tier requires browser-side submission (use test button in portal).'
                : (msg || 'Failed to dispatch email')
              return { success: false, error: cleanMsg }
            }
          } else if (provider === 'resend' && config.apiKey) {
            const resp = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${config.apiKey}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              },
              body: JSON.stringify({
                from: `${fromName} <onboarding@resend.dev>`,
                to: [recipient],
                subject,
                text: textMessage
              })
            })
            const result = await resp.json()
            return { success: resp.ok, result }
          } else if (provider === 'custom_webhook' && config.webhookUrl) {
            const resp = await fetch(config.webhookUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              },
              body: JSON.stringify({ inquiry, recipient, subject, message: textMessage })
            })
            return { success: resp.ok, message: 'Webhook dispatched' }
          }
          return { success: false, error: 'Provider unconfigured' }
        } catch (err: any) {
          console.error('Failed to send notification email:', err)
          return { success: false, error: err.message }
        }
      }

      // 2. Inquiries management
      server.middlewares.use('/api/inquiries', (req, res) => {
        const filePath = path.resolve(__dirname, 'src/data/inquiries.json')
        const getInquiries = () => {
          try {
            if (fs.existsSync(filePath)) {
              return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
            }
          } catch {}
          return []
        }

        if (req.method === 'GET') {
          const list = getInquiries()
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(list))
        } else if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })
          req.on('end', async () => {
            try {
              const newInq = JSON.parse(body)

              // Load notification config
              const notifPath = path.resolve(__dirname, 'src/data/notificationConfig.json')
              let notifConfig = {
                adminEmail: 'demicstructures@gmail.com',
                enableEmailNotification: true,
                provider: 'web3forms',
                accessKey: 'b94371fa-1fbe-4db5-9e32-23c3ca1ad7f4',
                fromName: 'Demics Homes Portal'
              }
              try {
                if (fs.existsSync(notifPath)) {
                  notifConfig = { ...notifConfig, ...JSON.parse(fs.readFileSync(notifPath, 'utf-8')) }
                }
              } catch {}

              let notificationResult = { success: false }
              if (notifConfig.enableEmailNotification !== false) {
                notificationResult = await sendNotificationEmail(newInq, notifConfig)
                newInq.notificationSent = notificationResult.success
                newInq.notifiedEmail = notifConfig.adminEmail
                if (!notificationResult.success && (notificationResult as any).error) {
                  newInq.notificationError = (notificationResult as any).error
                }

                try {
                  (notifConfig as any).lastNotificationSentAt = new Date().toISOString()
                  fs.writeFileSync(notifPath, JSON.stringify(notifConfig, null, 2), 'utf-8')
                } catch {}
              }

              const list = getInquiries()
              const updated = [newInq, ...list.filter((item: any) => item.id !== newInq.id)]
              fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, inquiry: newInq, notification: notificationResult }))
            } catch (err: any) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else if (req.method === 'PUT') {
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const updatedList = JSON.parse(body)
              fs.writeFileSync(filePath, JSON.stringify(updatedList, null, 2), 'utf-8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true }))
            } catch (err: any) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else {
          res.statusCode = 404
          res.end()
        }
      })

      // 2b. Notification Settings & Test Email Endpoints
      server.middlewares.use('/api/notification-config', (req, res) => {
        const notifPath = path.resolve(__dirname, 'src/data/notificationConfig.json')
        const getConfig = () => {
          try {
            if (fs.existsSync(notifPath)) {
              return JSON.parse(fs.readFileSync(notifPath, 'utf-8'))
            }
          } catch {}
          return {
            adminEmail: 'demicstructures@gmail.com',
            enableEmailNotification: true,
            provider: 'web3forms',
            accessKey: 'b94371fa-1fbe-4db5-9e32-23c3ca1ad7f4',
            fromName: 'Demics Homes Portal'
          }
        }

        if (req.method === 'GET') {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(getConfig()))
        } else if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const current = getConfig()
              const incoming = JSON.parse(body)
              const updated = { ...current, ...incoming }
              fs.writeFileSync(notifPath, JSON.stringify(updated, null, 2), 'utf-8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, config: updated }))
            } catch (err: any) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else {
          res.statusCode = 404
          res.end()
        }
      })

      server.middlewares.use('/api/send-test-notification', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try {
              const notifPath = path.resolve(__dirname, 'src/data/notificationConfig.json')
              let config = {
                adminEmail: 'demicstructures@gmail.com',
                enableEmailNotification: true,
                provider: 'web3forms',
                accessKey: 'b94371fa-1fbe-4db5-9e32-23c3ca1ad7f4',
                fromName: 'Demics Homes Portal'
              }
              if (fs.existsSync(notifPath)) {
                config = { ...config, ...JSON.parse(fs.readFileSync(notifPath, 'utf-8')) }
              }
              if (body) {
                try {
                  config = { ...config, ...JSON.parse(body) }
                } catch {}
              }

              const dummyInquiry = {
                id: 'test_' + Date.now(),
                name: 'Ademola (Test Notification)',
                phone: '09055428446',
                type: 'New build — duplex',
                location: 'Guzape, Abuja',
                message: 'This is a test notification from your Demics Homes Admin Portal to verify email delivery.',
                createdAt: new Date().toISOString()
              }

              const result = await sendNotificationEmail(dummyInquiry, config)
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: result.success, details: result, targetEmail: config.adminEmail }))
            } catch (err: any) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else {
          res.statusCode = 404
          res.end()
        }
      })

      // 3. Media Database & File Uploads
      server.middlewares.use('/api/upload', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const { originalName, mimeType, base64 } = JSON.parse(body)
              if (!base64) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'No file data provided' }))
                return
              }

              const buffer = Buffer.from(base64, 'base64')
              const uploadsDir = path.resolve(__dirname, 'public/uploads')
              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true })
              }

              const safeOriginal = (originalName || 'file').replace(/[^a-zA-Z0-9._-]/g, '_')
              const filename = `${Date.now()}-${safeOriginal}`
              const diskPath = path.join(uploadsDir, filename)
              fs.writeFileSync(diskPath, buffer)

              const isVideo = (mimeType && mimeType.startsWith('video/')) || /\.(mp4|mov|webm|ogg)$/i.test(safeOriginal)
              const mediaItem = {
                id: 'med_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
                filename,
                originalName: originalName || filename,
                url: `/uploads/${filename}`,
                mimeType: mimeType || (isVideo ? 'video/mp4' : 'image/jpeg'),
                size: buffer.length,
                type: isVideo ? 'video' : 'image',
                uploadedAt: new Date().toISOString(),
                provider: 'local'
              }

              // Update media.json database
              const mediaDbPath = path.resolve(__dirname, 'src/data/media.json')
              let mediaList: any[] = []
              try {
                if (fs.existsSync(mediaDbPath)) {
                  mediaList = JSON.parse(fs.readFileSync(mediaDbPath, 'utf-8'))
                }
              } catch {}

              mediaList.unshift(mediaItem)
              fs.writeFileSync(mediaDbPath, JSON.stringify(mediaList, null, 2), 'utf-8')

              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, media: mediaItem }))
            } catch (err: any) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else {
          res.statusCode = 404
          res.end()
        }
      })

      // 4. Media Management (list, register cloud media, delete)
      server.middlewares.use('/api/media', (req, res) => {
        const mediaDbPath = path.resolve(__dirname, 'src/data/media.json')
        const getMedia = () => {
          try {
            if (fs.existsSync(mediaDbPath)) {
              return JSON.parse(fs.readFileSync(mediaDbPath, 'utf-8'))
            }
          } catch {}
          return []
        }

        if (req.method === 'GET') {
          const list = getMedia()
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(list))
        } else if (req.method === 'POST') {
          // Register media record (e.g. from Cloudinary upload or external link)
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const item = JSON.parse(body)
              const list = getMedia()
              const updated = [item, ...list.filter((m: any) => m.id !== item.id)]
              fs.writeFileSync(mediaDbPath, JSON.stringify(updated, null, 2), 'utf-8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, media: item }))
            } catch (err: any) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else if (req.method === 'DELETE') {
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const { id } = JSON.parse(body)
              const list = getMedia()
              const target = list.find((m: any) => m.id === id)
              if (target && target.provider === 'local' && target.filename) {
                const diskPath = path.resolve(__dirname, 'public/uploads', target.filename)
                if (fs.existsSync(diskPath)) {
                  try {
                    fs.unlinkSync(diskPath)
                  } catch {}
                }
              }
              const updated = list.filter((m: any) => m.id !== id)
              fs.writeFileSync(mediaDbPath, JSON.stringify(updated, null, 2), 'utf-8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true }))
            } catch (err: any) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else {
          res.statusCode = 404
          res.end()
        }
      })

      // 5. Media Cloud Storage Config (Cloudinary / Supabase credentials)
      server.middlewares.use('/api/media-config', (req, res) => {
        const configPath = path.resolve(__dirname, 'src/data/mediaConfig.json')
        if (req.method === 'GET') {
          try {
            if (fs.existsSync(configPath)) {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(fs.readFileSync(configPath, 'utf-8'))
              return
            }
          } catch {}
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ provider: 'local' }))
        } else if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const config = JSON.parse(body)
              fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true }))
            } catch (err: any) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else {
          res.statusCode = 404
          res.end()
        }
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), backendPlugin()],
})
