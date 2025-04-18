document.addEventListener("DOMContentLoaded", () => {
  const app = new EchoForge();
  app.init();
});

class EchoForge {
  constructor() {
    // State management
    this.state = {
      theme: localStorage.getItem("theme") || "dark",
      currentWebhookUrl: localStorage.getItem("currentWebhookUrl") || "",
      webhooks: JSON.parse(localStorage.getItem("webhooks") || "[]"),
      currentMessage: JSON.parse(
        localStorage.getItem("currentMessage") ||
          JSON.stringify({
            content: "Welcome to **EchoForge**! The easiest way to personalize your Discord server.",
            username: "",
            avatar_url: "",
            embeds: [],
          }),
      ),
      currentEmbedId: null,
      currentFieldId: null,
      debugMode: false,
    }

    // DOM elements
    this.elements = {}
    this.initElements()
  }

  initElements() {
    // Theme toggle
    this.elements.themeToggle = document.getElementById("theme-toggle")

    // Webhook elements
    this.elements.webhookInput = document.getElementById("webhook-url")
    this.elements.webhookDropdownBtn = document.getElementById("webhook-dropdown-btn")
    this.elements.addWebhookBtn = document.getElementById("add-webhook-btn")

    // Message content elements
    this.elements.messageContent = document.getElementById("message-content")
    this.elements.contentChars = document.getElementById("content-chars")
    this.elements.username = document.getElementById("username")
    this.elements.avatarUrl = document.getElementById("avatar-url")

    // Tab elements
    this.elements.tabButtons = document.querySelectorAll(".tab-btn")
    this.elements.tabContents = document.querySelectorAll(".tab-content")

    // Embed elements
    this.elements.addEmbedBtn = document.getElementById("add-embed-btn")
    this.elements.addEmbedBtnAlt = document.getElementById("add-embed-btn-alt")
    this.elements.embedsList = document.getElementById("embeds-list")

    // Action buttons
    this.elements.saveBtn = document.getElementById("save-btn")
    this.elements.clearBtn = document.getElementById("clear-btn")
    this.elements.exportBtn = document.getElementById("export-btn")
    this.elements.jsonBtn = document.getElementById("json-btn")
    this.elements.sendBtn = document.getElementById("send-btn")

    // Debug mode
    this.elements.debugModeToggle = document.getElementById("debug-mode")

    // Message preview
    this.elements.messagePreview = document.getElementById("message-preview")

    // Support links
    this.elements.supportServer = document.getElementById("support-server")
    this.elements.discordBot = document.getElementById("discord-bot")
    this.elements.settingsBtn = document.getElementById("settings-btn")

    // Other buttons
    this.elements.markdownBtn = document.getElementById("markdown-btn")
    this.elements.emojiBtn = document.getElementById("emoji-btn")
    this.elements.editMessageBtn = document.getElementById("edit-message-btn")
  }

  init() {
  // Apply initial theme
  this.applyTheme();

  // Set initial values
  if (this.elements.webhookInput) {
    this.elements.webhookInput.value = this.state.currentWebhookUrl;
  }

  if (this.elements.messageContent) {
    this.elements.messageContent.value = this.state.currentMessage.content;
  }

  if (this.elements.username) {
    this.elements.username.value = this.state.currentMessage.username || "";
  }

  if (this.elements.avatarUrl) {
    this.elements.avatarUrl.value = this.state.currentMessage.avatar_url || "";
  }

  // Update character count
  if (this.elements.messageContent && this.elements.contentChars) {
    this.updateCharCount(this.elements.messageContent, this.elements.contentChars);
  }

  // Init UI
  this.renderMessagePreview();
  this.renderEmbeds();
  this.setupEventListeners();

  // ✅ Hide loader after a short delay
  console.log("EchoForge initialized");
  const loader = document.getElementById("loader-overlay");
  if (loader) {
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";
    setTimeout(() => loader.remove(), 500);
  }
}

    if (this.elements.messageContent) {
      this.elements.messageContent.value = this.state.currentMessage.content
    }

    if (this.elements.username) {
      this.elements.username.value = this.state.currentMessage.username || ""
    }

    if (this.elements.avatarUrl) {
      this.elements.avatarUrl.value = this.state.currentMessage.avatar_url || ""
    }

    // Update character counts
    if (this.elements.messageContent && this.elements.contentChars) {
      this.updateCharCount(this.elements.messageContent, this.elements.contentChars)
    }

    // Render message preview
    this.renderMessagePreview()

    // Render embeds
    this.renderEmbeds()

    // Setup event listeners
    this.setupEventListeners()
  }

  setupEventListeners() {
    // Theme toggle
    if (this.elements.themeToggle) {
      this.elements.themeToggle.addEventListener("click", () => {
        this.toggleTheme()
      })
    }

    // Tab switching
    if (this.elements.tabButtons) {
      this.elements.tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const tabName = button.getAttribute("data-tab")
          this.switchTab(tabName)
        })
      })
    }

    // Webhook input
    if (this.elements.webhookInput) {
      this.elements.webhookInput.addEventListener("input", (e) => {
        this.state.currentWebhookUrl = e.target.value
        localStorage.setItem("currentWebhookUrl", this.state.currentWebhookUrl)
      })
    }

    // Message content input
    if (this.elements.messageContent) {
      this.elements.messageContent.addEventListener("input", (e) => {
        this.state.currentMessage.content = e.target.value
        this.updateCharCount(e.target, this.elements.contentChars)
        this.saveCurrentMessage()
        this.renderMessagePreview()
      })
    }

    // Username input
    if (this.elements.username) {
      this.elements.username.addEventListener("input", (e) => {
        this.state.currentMessage.username = e.target.value
        this.saveCurrentMessage()
        this.renderMessagePreview()
      })
    }

    // Avatar URL input
    if (this.elements.avatarUrl) {
      this.elements.avatarUrl.addEventListener("input", (e) => {
        this.state.currentMessage.avatar_url = e.target.value
        this.saveCurrentMessage()
        this.renderMessagePreview()
      })
    }

    // Debug mode toggle
    if (this.elements.debugModeToggle) {
      this.elements.debugModeToggle.addEventListener("change", (e) => {
        this.state.debugMode = e.target.checked
      })
    }

    // Add embed button
    if (this.elements.addEmbedBtn) {
      this.elements.addEmbedBtn.addEventListener("click", () => {
        this.addEmbed()
      })
    }

    // Add embed button (alternative)
    if (this.elements.addEmbedBtnAlt) {
      this.elements.addEmbedBtnAlt.addEventListener("click", () => {
        this.addEmbed()
      })
    }

    // Clear button
    if (this.elements.clearBtn) {
      this.elements.clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all content? This cannot be undone.")) {
          this.clearAll()
        }
      })
    }

    // Export button
    if (this.elements.exportBtn) {
      this.elements.exportBtn.addEventListener("click", () => {
        this.exportJson()
      })
    }

    // JSON button
    if (this.elements.jsonBtn) {
      this.elements.jsonBtn.addEventListener("click", () => {
        this.openJsonEditor()
      })
    }

    // Send button
    if (this.elements.sendBtn) {
      this.elements.sendBtn.addEventListener("click", () => {
        this.sendMessage()
      })
    }

    // Add webhook button
    if (this.elements.addWebhookBtn) {
      this.elements.addWebhookBtn.addEventListener("click", () => {
        this.showToast("Add Webhook", "Webhook management is coming soon!", "info")
      })
    }

    // Support server link
    if (this.elements.supportServer) {
      this.elements.supportServer.addEventListener("click", (e) => {
        e.preventDefault()
        window.open("https://discord.gg/echoforge", "_blank")
        this.showToast("Support Server", "Opening the EchoForge support server...", "info")
      })
    }

    // Discord bot link
    if (this.elements.discordBot) {
      this.elements.discordBot.addEventListener("click", (e) => {
        e.preventDefault()
        window.open(
          "https://discord.com/api/oauth2/authorize?client_id=12345&permissions=2147483647&scope=bot",
          "_blank",
        )
        this.showToast("Discord Bot", "Inviting the EchoForge bot to your server...", "info")
      })
    }

    // Settings button
    if (this.elements.settingsBtn) {
      this.elements.settingsBtn.addEventListener("click", (e) => {
        e.preventDefault()
        this.showToast("Settings", "Settings panel is coming soon!", "info")
      })
    }

    // Markdown button
    if (this.elements.markdownBtn) {
      this.elements.markdownBtn.addEventListener("click", () => {
        document.getElementById("markdown-modal").classList.add("active")
      })

      const closeBtn = document.getElementById("markdown-modal-close")
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          document.getElementById("markdown-modal").classList.remove("active")
        })
      }
    }

    // Emoji button
    if (this.elements.emojiBtn) {
      this.elements.emojiBtn.addEventListener("click", () => {
        this.showToast("Emoji Picker", "Emoji picker is coming soon!", "info")
      })
    }

    // Edit message button
    if (this.elements.editMessageBtn) {
      this.elements.editMessageBtn.addEventListener("click", () => {
        this.showToast("Edit Message", "Message editing feature is coming soon!", "info")
      })
    }

    // Save button
    if (this.elements.saveBtn) {
      this.elements.saveBtn.addEventListener("click", () => {
        this.showToast("Save Message", "Message saving is coming soon!", "info")
      })
    }
  }

  applyTheme() {
    if (this.state.theme === "dark") {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }
  }

  toggleTheme() {
    this.state.theme = this.state.theme === "dark" ? "light" : "dark"
    localStorage.setItem("theme", this.state.theme)
    this.applyTheme()
  }

  switchTab(tabName) {
    this.elements.tabButtons.forEach((button) => {
      if (button.getAttribute("data-tab") === tabName) {
        button.classList.add("active")
      } else {
        button.classList.remove("active")
      }
    })

    this.elements.tabContents.forEach((content) => {
      if (content.id === `${tabName}-tab`) {
        content.classList.remove("hidden")
      } else {
        content.classList.add("hidden")
      }
    })
  }

  updateCharCount(input, counter) {
    const maxLength = Number.parseInt(input.getAttribute("maxlength") || "2000", 10)
    counter.textContent = input.value.length

    // Check if approaching or exceeding limit
    if (input.value.length > maxLength * 0.9) {
      counter.classList.add("warning")
    } else {
      counter.classList.remove("warning")
    }

    if (input.value.length >= maxLength) {
      counter.classList.add("error")
    } else {
      counter.classList.remove("error")
    }
  }

  saveCurrentMessage() {
    localStorage.setItem("currentMessage", JSON.stringify(this.state.currentMessage))
  }

  renderMessagePreview() {
    if (!this.elements.messagePreview) return

    const { content, username, avatar_url, embeds } = this.state.currentMessage

    // Create message container
    let previewHTML = `
      <div class="message-preview-container">
        <div class="avatar">
          ${
            avatar_url
              ? `<img src="${avatar_url}" alt="${username || "EchoForge"}" onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\\'avatar-fallback\\'>${(username || "E").charAt(0).toUpperCase()}</div>'">`
              : `<div class="avatar-fallback">${(username || "E").charAt(0).toUpperCase()}</div>`
          }
        </div>
        <div class="message-content">
          <div class="message-header">
            <span class="author-name">${username || "EchoForge"}</span>
            <span class="bot-badge">BOT</span>
            <span class="timestamp">${this.formatTimestamp(new Date())}</span>
          </div>
          ${content ? `<div class="message-text">${this.formatDiscordContent(content)}</div>` : ""}
    `

    // Add embeds
    if (embeds && embeds.length > 0) {
      embeds.forEach((embed) => {
        // Skip empty embeds
        if (!embed.title && !embed.description && (!embed.fields || embed.fields.length === 0)) {
          return
        }

        previewHTML += `
          <div class="embed" style="border-left-color: ${embed.color || "#5865F2"}">
            <div class="embed-content">
        `

        // Author
        if (embed.author && embed.author.name) {
          previewHTML += `
            <div class="embed-author">
              ${embed.author.icon_url ? `<img src="${embed.author.icon_url}" class="embed-author-icon" onerror="this.style.display='none'">` : ""}
              ${embed.author.url ? `<a href="${embed.author.url}" target="_blank" rel="noopener noreferrer">${embed.author.name}</a>` : embed.author.name}
            </div>
          `
        }

        // Title
        if (embed.title) {
          previewHTML += `<div class="embed-title">${embed.title}</div>`
        }

        // Description
        if (embed.description) {
          previewHTML += `<div class="embed-description">${this.formatDiscordContent(embed.description)}</div>`
        }

        // Fields
        if (embed.fields && embed.fields.length > 0) {
          previewHTML += `<div class="embed-fields">`

          embed.fields.forEach((field) => {
            if (field.name && field.value) {
              previewHTML += `
                <div class="embed-field ${field.inline ? "" : "full"}">
                  <div class="field-name">${field.name}</div>
                  <div class="field-value">${this.formatDiscordContent(field.value)}</div>
                </div>
              `
            }
          })

          previewHTML += `</div>`
        }

        // Image
        if (embed.image && embed.image.url) {
          previewHTML += `<img src="${embed.image.url}" class="embed-image" onerror="this.style.display='none'">`
        }

        // Footer
        if (embed.footer && embed.footer.text) {
          previewHTML += `
            <div class="embed-footer">
              ${embed.footer.icon_url ? `<img src="${embed.footer.icon_url}" class="embed-footer-icon" onerror="this.style.display='none'">` : ""}
              <span>${embed.footer.text}</span>
            </div>
          `
        }

        // Thumbnail
        if (embed.thumbnail && embed.thumbnail.url) {
          previewHTML += `<img src="${embed.thumbnail.url}" class="embed-thumbnail" onerror="this.style.display='none'">`
        }

        previewHTML += `
            </div>
          </div>
        `
      })
    }

    previewHTML += `
        </div>
      </div>
    `

    this.elements.messagePreview.innerHTML = previewHTML
  }

  formatTimestamp(date) {
    const today = new Date()
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()

    if (isToday) {
      return `Today at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
    }

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()

    if (isYesterday) {
      return `Yesterday at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  formatDiscordContent(text) {
    // Process Discord custom emojis: <:name:id> or <a:name:id>
    const emojiRegex = /<(a)?:([a-zA-Z0-9_]+):(\d+)>/g

    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/__(.*?)__/g, "<u>$1</u>")
      .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
      .replace(/```(.*?)```/gs, '<pre class="code-block">$1</pre>')
      .replace(/\n/g, "<br />")
      .replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" class="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
      )

    // Replace Discord custom emojis with images
    formattedText = formattedText.replace(emojiRegex, (match, animated, name, id) => {
      const extension = animated ? "gif" : "png"
      return `<img 
        src="https://cdn.discordapp.com/emojis/${id}.${extension}" 
        alt=":${name}:" 
        title=":${name}:" 
        class="inline-block h-5 w-5 align-middle" 
        onerror="this.style.display='none'"
      />`
    })

    return formattedText
  }

  generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  addEmbed() {
    const newEmbed = {
      id: this.generateId(),
      title: "New Embed",
      description: "",
      color: "#5865F2",
      fields: [],
    }

    if (!this.state.currentMessage.embeds) {
      this.state.currentMessage.embeds = []
    }

    this.state.currentMessage.embeds.push(newEmbed)
    this.saveCurrentMessage()
    this.renderEmbeds()
    this.renderMessagePreview()

    // Switch to embeds tab
    if (this.elements.tabButtons) {
      this.switchTab("embeds")
    }

    // Show toast
    this.showToast("Embed Added", "New embed has been added to your message", "success")
  }

  renderEmbeds() {
    if (!this.elements.embedsList) return

    const { embeds } = this.state.currentMessage

    if (!embeds || embeds.length === 0) {
      this.elements.embedsList.innerHTML = `
        <div class="no-embeds-message">
          <p>No embeds added yet</p>
          <button class="add-embed-btn-alt" id="add-embed-btn-alt">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            Add Embed
          </button>
        </div>
      `

      // Attach event listener to the new button
      const addEmbedBtnAlt = document.getElementById("add-embed-btn-alt")
      if (addEmbedBtnAlt) {
        addEmbedBtnAlt.addEventListener("click", () => {
          this.addEmbed()
        })
      }

      return
    }

    let embedsHTML = ""

    embeds.forEach((embed) => {
      embedsHTML += `
        <div class="embed-item" data-id="${embed.id}">
          <div class="embed-item-header">
            <div class="embed-color-bar" style="background-color: ${embed.color || "#5865F2"}"></div>
            <div class="embed-item-title">${embed.title || "Untitled Embed"}</div>
            <div class="embed-item-actions">
              <button class="embed-action-btn edit-embed" data-id="${embed.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="embed-action-btn delete delete-embed" data-id="${embed.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </div>
        </div>
      `
    })

    this.elements.embedsList.innerHTML = embedsHTML

    // Attach event listeners to the new buttons
    document.querySelectorAll(".edit-embed").forEach((button) => {
      button.addEventListener("click", (e) => {
        const embedId = e.currentTarget.getAttribute("data-id")
        this.showToast("Edit Embed", "Embed editing is coming soon!", "info")
      })
    })

    document.querySelectorAll(".delete-embed").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation()
        const embedId = e.currentTarget.getAttribute("data-id")
        this.deleteEmbed(embedId)
      })
    })
  }

  deleteEmbed(embedId) {
    const embedIndex = this.state.currentMessage.embeds.findIndex((embed) => embed.id === embedId)

    if (embedIndex === -1) return

    if (confirm("Are you sure you want to delete this embed?")) {
      this.state.currentMessage.embeds.splice(embedIndex, 1)
      this.saveCurrentMessage()
      this.renderEmbeds()
      this.renderMessagePreview()

      // Show toast
      this.showToast("Embed Deleted", "Embed has been removed from your message", "success")
    }
  }

  clearAll() {
    this.state.currentMessage = {
      content: "",
      username: "",
      avatar_url: "",
      embeds: [],
    }

    if (this.elements.messageContent) {
      this.elements.messageContent.value = ""
    }

    if (this.elements.username) {
      this.elements.username.value = ""
    }

    if (this.elements.avatarUrl) {
      this.elements.avatarUrl.value = ""
    }

    if (this.elements.messageContent && this.elements.contentChars) {
      this.updateCharCount(this.elements.messageContent, this.elements.contentChars)
    }

    this.saveCurrentMessage()
    this.renderEmbeds()
    this.renderMessagePreview()

    this.showToast("Cleared", "All content has been cleared", "success")
  }

  exportJson() {
    const jsonContent = JSON.stringify(this.state.currentMessage, null, 2)

    // Create a blob and download it
    const blob = new Blob([jsonContent], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "echoforge_message.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    this.showToast("Exported", "Message exported as JSON file", "success")
  }

  openJsonEditor() {
    this.showToast("JSON Editor", "JSON editor is coming soon!", "info")
  }

  sendMessage() {
    const { currentMessage, currentWebhookUrl, debugMode } = this.state

    if (!currentWebhookUrl) {
      this.showToast("Error", "Please enter a webhook URL", "error")
      return
    }

    if (!this.validateWebhookUrl(currentWebhookUrl)) {
      this.showToast("Invalid Webhook URL", "Please enter a valid Discord webhook URL", "error")
      return
    }

    if (!currentMessage.content && (!currentMessage.embeds || currentMessage.embeds.length === 0)) {
      this.showToast("Empty Message", "Your message must contain either text content or at least one embed", "error")
      return
    }

    // Show sending toast
    this.showToast("Sending...", "Sending your message to Discord", "info")

    if (debugMode) {
      this.exportJson()
      this.showToast("Debug Mode", "Payload prepared but not sent. Review the JSON and send manually.", "info")
      return
    }

    // Clean up the message payload
    const payload = this.prepareWebhookPayload(currentMessage)

    // Send the webhook
    fetch(currentWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            try {
              const errorData = JSON.parse(text)
              throw new Error(`Discord API Error: ${errorData.message}`)
            } catch (e) {
              throw new Error(`HTTP error! Status: ${response.status} - ${text || ""}`)
            }
          })
        }

        this.showToast("Success", "Message sent successfully!", "success")
        return true
      })
      .catch((error) => {
        this.showToast("Error sending webhook", error.message || "Unknown error occurred", "error")
        return false
      })
  }

  prepareWebhookPayload(message) {
    // Clean up the message payload to remove empty fields
    const cleanedEmbeds = message.embeds
      .filter((embed) => embed.title || embed.description || (embed.fields && embed.fields.length > 0))
      .map((embed) => {
        // Convert hex color to integer (Discord requirement)
        const colorInt = embed.color ? Number.parseInt(embed.color.replace("#", ""), 16) : undefined

        // Only include fields that have both name and value
        const fields = embed.fields
          ? embed.fields
              .filter((field) => field.name && field.value)
              .map((field) => ({
                name: field.name,
                value: field.value,
                inline: field.inline,
              }))
          : []

        // Build a clean embed object
        const cleanEmbed = {}

        if (embed.title) cleanEmbed.title = embed.title
        if (embed.description) cleanEmbed.description = embed.description
        if (colorInt) cleanEmbed.color = colorInt
        if (fields.length > 0) cleanEmbed.fields = fields

        // Only add author if name exists
        if (embed.author && embed.author.name) {
          cleanEmbed.author = { name: embed.author.name }
          if (embed.author.url) cleanEmbed.author.url = embed.author.url
          if (embed.author.icon_url) cleanEmbed.author.icon_url = embed.author.icon_url
        }

        // Only add footer if text exists
        if (embed.footer && embed.footer.text) {
          cleanEmbed.footer = { text: embed.footer.text }
          if (embed.footer.icon_url) cleanEmbed.footer.icon_url = embed.footer.icon_url
        }

        // Only add image if url exists
        if (embed.image && embed.image.url) {
          cleanEmbed.image = { url: embed.image.url }
        }

        // Only add thumbnail if url exists
        if (embed.thumbnail && embed.thumbnail.url) {
          cleanEmbed.thumbnail = { url: embed.thumbnail.url }
        }

        return cleanEmbed
      })

    // Prepare the final payload
    const payload = {}

    // Only add content if it's not empty
    if (message.content && message.content.trim()) {
      payload.content = message.content
    }

    // Only add embeds if there are valid ones
    if (cleanedEmbeds.length > 0) {
      payload.embeds = cleanedEmbeds
    }

    // Only add username and avatar_url if they exist
    if (message.username) payload.username = message.username
    if (message.avatar_url) payload.avatar_url = message.avatar_url

    return payload
  }

  validateWebhookUrl(url) {
    if (!url) return false

    try {
      const parsedUrl = new URL(url)

      // Must be HTTPS
      if (parsedUrl.protocol !== "https:") return false

      // Must be discord.com domain
      if (!parsedUrl.hostname.endsWith("discord.com")) return false

      // Must start with /api/webhooks/
      if (!parsedUrl.pathname.startsWith("/api/webhooks/")) return false

      // Should have at least 2 path segments after /api/webhooks/
      const pathParts = parsedUrl.pathname.split("/").filter(Boolean)
      if (pathParts.length < 4) return false // ["api", "webhooks", "{id}", "{token}"]

      return true
    } catch (e) {
      // URL parsing failed
      return false
    }
  }

  showToast(title, message, type = "info") {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector(".toast-container")

    if (!toastContainer) {
      toastContainer = document.createElement("div")
      toastContainer.className = "toast-container"
      document.body.appendChild(toastContainer)
    }

    // Create toast element
    const toast = document.createElement("div")
    toast.className = `toast ${type}`

    // Set icon based on type
    let icon = ""
    switch (type) {
      case "success":
        icon =
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
        break
      case "error":
        icon =
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
        break
      case "warning":
        icon =
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
        break
      case "info":
      default:
        icon =
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
        break
    }

    // Set toast content
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close">&times;</button>
    `

    // Add toast to container
    toastContainer.appendChild(toast)

    // Add event listener to close button
    toast.querySelector(".toast-close").addEventListener("click", () => {
      toast.classList.add("hide")
      setTimeout(() => {
        toast.remove()
      }, 300)
    })

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      toast.classList.add("hide")
      setTimeout(() => {
        toast.remove()
      }, 300)
    }, 5000)
  }
}

window.addEventListener("load", () => {
  const loader = document.getElementById("loader-overlay");
  if (loader) {
    console.log("Failsafe loader removal triggered");
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";
    setTimeout(() => loader.remove(), 500);
  }
});


window.addEventListener("load", () => {
  const loader = document.getElementById("loader-overlay");
  if (loader) {
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";
    setTimeout(() => loader.remove(), 500);
  }
});
