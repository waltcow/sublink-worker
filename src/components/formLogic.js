import { parseSurgeConfigInput } from "../utils/surgeConfigParser.js";

export const formLogicFn = (t) => {
  window.formData = function () {
    return {
      input: "",
      showAdvanced: false,
      // Accordion states for each section (二级手风琴状态)
      accordionSections: {
        rules: true, // 规则选择 - 默认展开
        customRules: false, // 自定义规则
        general: false, // 通用设置
        baseConfig: false, // 基础配置
      },
      selectedRules: [],
      selectedPredefinedRule: "balanced",
      groupByCountry: false,
      keywordGroups: [], // 关键词分组配置
      includeCountries: [], // 国家过滤配置
      enableClashUI: false,
      externalController: "",
      externalUiDownloadUrl: "",
      ruleProviderFormat: "yaml",
      configType: "clash",
      configEditor: "",
      savingConfig: false,
      currentConfigId: "",
      saveConfigText: "",
      savingConfigText: "",
      configContentRequiredText: "",
      configSaveFailedText: "",
      configValidationState: "",
      configValidationMessage: "",
      loading: false,
      generatedLinks: null,
      shortenedLinks: null,
      shortening: false,
      customShortCode: "",
      parsingUrl: false,
      parseDebounceTimer: null,
      // Emoji picker state
      showEmojiPicker: null, // Index of group showing picker
      commonEmojis: [
        "🏢",
        "🎮",
        "📺",
        "🤖",
        "☁️",
        "🌐",
        "🚀",
        "🔓",
        "🔒",
        "🛡️",
        "⚙️",
        "📍",
        "🗺️",
        "🚩",
        "🏁",
        "📶",
        "📡",
        "🔋",
        "🔌",
        "💻",
        "🎬",
        "🎧",
        "🎤",
        "🎨",
        "🎭",
        "🎫",
      ],
      // These will be populated from window.APP_TRANSLATIONS
      processingText: "",
      convertText: "",
      shortenLinksText: "",
      shorteningText: "",
      showFullLinksText: "",

      init() {
        // Load translations
        if (window.APP_TRANSLATIONS) {
          this.processingText = window.APP_TRANSLATIONS.processing;
          this.convertText = window.APP_TRANSLATIONS.convert;
          this.shortenLinksText = window.APP_TRANSLATIONS.shortenLinks;
          this.shorteningText = window.APP_TRANSLATIONS.shortening;
          this.showFullLinksText = window.APP_TRANSLATIONS.showFullLinks;
          this.saveConfigText = window.APP_TRANSLATIONS.saveConfig;
          this.savingConfigText = window.APP_TRANSLATIONS.savingConfig;
          this.configContentRequiredText =
            window.APP_TRANSLATIONS.configContentRequired;
          this.configSaveFailedText = window.APP_TRANSLATIONS.configSaveFailed;
        }

        // Load saved data
        this.input = localStorage.getItem("inputTextarea") || "";
        this.showAdvanced = localStorage.getItem("advancedToggle") === "true";

        // Register global event listeners once to avoid duplicate handlers.
        if (!window.__sublinkFormEventHandlers) {
          window.__sublinkFormEventHandlers = {
            loadProfile: (e) =>
              window.__sublinkFormInstance?.loadProfileData?.(e.detail),
            requestSaveProfile: () =>
              window.__sublinkFormInstance?.requestSaveProfile?.(),
            exportConfig: () => window.__sublinkFormInstance?.exportConfig?.(),
            importConfig: () =>
              window.__sublinkFormInstance?.$refs?.fileInput?.click(),
          };
          window.addEventListener(
            "load-profile",
            window.__sublinkFormEventHandlers.loadProfile,
          );
          window.addEventListener(
            "request-save-profile",
            window.__sublinkFormEventHandlers.requestSaveProfile,
          );
          window.addEventListener(
            "export-config",
            window.__sublinkFormEventHandlers.exportConfig,
          );
          window.addEventListener(
            "import-config",
            window.__sublinkFormEventHandlers.importConfig,
          );
        }
        window.__sublinkFormInstance = this;

        this.groupByCountry = localStorage.getItem("groupByCountry") === "true";
        this.enableClashUI = localStorage.getItem("enableClashUI") === "true";
        this.externalController =
          localStorage.getItem("externalController") || "";
        this.externalUiDownloadUrl =
          localStorage.getItem("externalUiDownloadUrl") || "";
        this.ruleProviderFormat =
          localStorage.getItem("ruleProviderFormat") || "yaml";
        this.configEditor = localStorage.getItem("configEditor") || "";
        this.configType = localStorage.getItem("configType") || "clash";
        this.customShortCode = localStorage.getItem("customShortCode") || "";
        this.selectedPredefinedRule =
          localStorage.getItem("selectedPredefinedRule") || "balanced";
        const savedSelectedRules = localStorage.getItem("selectedRules");
        if (savedSelectedRules) {
          try {
            this.selectedRules = JSON.parse(savedSelectedRules);
          } catch (e) {
            this.selectedRules = [];
          }
        }

        // Load custom rules
        const savedCustomRules = localStorage.getItem("customRules");
        if (savedCustomRules) {
          try {
            const parsed = JSON.parse(savedCustomRules);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setTimeout(() => {
                window.dispatchEvent(
                  new CustomEvent("restore-custom-rules", {
                    detail: { rules: parsed },
                  }),
                );
              }, 100);
            }
          } catch (e) {
            console.warn("Failed to parse saved customRules:", e);
          }
        }

        const initialUrlParams = new URLSearchParams(window.location.search);
        this.currentConfigId = initialUrlParams.get("configId") || "";

        // Load accordion states
        const savedAccordion = localStorage.getItem("accordionSections");
        if (savedAccordion) {
          try {
            this.accordionSections = JSON.parse(savedAccordion);
          } catch (e) {
            // If parsing fails, keep defaults
          }
        }

        // Load keyword groups
        const savedKeywordGroups = localStorage.getItem("keywordGroups");
        if (savedKeywordGroups) {
          try {
            this.keywordGroups = JSON.parse(savedKeywordGroups);
          } catch (e) {
            this.keywordGroups = [];
          }
        }

        // Load include countries
        const savedIncludeCountries = localStorage.getItem("includeCountries");
        if (savedIncludeCountries) {
          try {
            this.includeCountries = JSON.parse(savedIncludeCountries);
          } catch (e) {
            this.includeCountries = [];
          }
        }

        // Initialize rules
        this.applyPredefinedRule();

        // Watchers to save state
        this.$watch("input", (val) => {
          localStorage.setItem("inputTextarea", val);
          this.handleInputChange(val);
        });
        this.$watch("showAdvanced", (val) =>
          localStorage.setItem("advancedToggle", val),
        );
        this.$watch("groupByCountry", (val) =>
          localStorage.setItem("groupByCountry", val),
        );
        this.$watch("enableClashUI", (val) =>
          localStorage.setItem("enableClashUI", val),
        );
        this.$watch("externalController", (val) =>
          localStorage.setItem("externalController", val),
        );
        this.$watch("externalUiDownloadUrl", (val) =>
          localStorage.setItem("externalUiDownloadUrl", val),
        );
        this.$watch("ruleProviderFormat", (val) =>
          localStorage.setItem("ruleProviderFormat", val),
        );
        this.$watch("configEditor", (val) => {
          localStorage.setItem("configEditor", val);
          this.resetConfigValidation();
        });
        this.$watch("configType", (val) => {
          localStorage.setItem("configType", val);
          this.resetConfigValidation();
        });
        this.$watch("selectedRules", (val) =>
          localStorage.setItem("selectedRules", JSON.stringify(val)),
        );
        this.$watch("selectedPredefinedRule", (val) =>
          localStorage.setItem("selectedPredefinedRule", val),
        );
        this.$watch("customShortCode", (val) =>
          localStorage.setItem("customShortCode", val),
        );
        this.$watch(
          "accordionSections",
          (val) =>
            localStorage.setItem("accordionSections", JSON.stringify(val)),
          { deep: true },
        );
        this.$watch(
          "keywordGroups",
          (val) => localStorage.setItem("keywordGroups", JSON.stringify(val)),
          { deep: true },
        );
        this.$watch(
          "includeCountries",
          (val) =>
            localStorage.setItem("includeCountries", JSON.stringify(val)),
          { deep: true },
        );
      },

      requestSaveProfile() {
        const name = prompt(
          window.APP_TRANSLATIONS.profileNamePlaceholder || "Profile Name",
        );
        if (!name || !name.trim()) return;

        const customRulesInput = document.querySelector(
          'input[name="customRules"]',
        );
        const customRules =
          customRulesInput && customRulesInput.value
            ? JSON.parse(customRulesInput.value)
            : [];

        const profile = {
          name: name.trim(),
          timestamp: new Date().toISOString(),
          settings: {
            input: this.input,
            selectedRules: this.selectedRules,
            selectedPredefinedRule: this.selectedPredefinedRule,
            customRules: customRules,
            groupByCountry: this.groupByCountry,
            enableClashUI: this.enableClashUI,
            externalController: this.externalController,
            externalUiDownloadUrl: this.externalUiDownloadUrl,
            ruleProviderFormat: this.ruleProviderFormat,
            configType: this.configType,
            configEditor: this.configEditor,
            keywordGroups: this.keywordGroups,
            includeCountries: this.includeCountries,
            customShortCode: this.customShortCode,
            accordionSections: this.accordionSections,
          },
        };

        const index = Alpine.store("profiles").list.findIndex(
          (p) => p.name === profile.name,
        );
        if (index >= 0) {
          if (
            !confirm(
              (window.APP_TRANSLATIONS.overwriteProfile ||
                "Overwrite existing profile?") + ` "${profile.name}"`,
            )
          ) {
            return;
          }
        }

        Alpine.store("profiles").add(profile);
        alert(
          window.APP_TRANSLATIONS.profileSaved || "Profile saved successfully",
        );
      },

      loadProfileData(profile) {
        if (!profile) return;

        // Confirm load
        if (
          !confirm(
            (window.APP_TRANSLATIONS.loadProfileConfirm ||
              "Load this profile? Unsaved changes will be lost.") +
              `\n"${profile.name}"`,
          )
        ) {
          return;
        }

        const settings = profile.settings;

        if (settings.input !== undefined) this.input = settings.input;
        if (settings.selectedRules !== undefined)
          this.selectedRules = settings.selectedRules;
        if (settings.selectedPredefinedRule !== undefined)
          this.selectedPredefinedRule = settings.selectedPredefinedRule;
        if (settings.groupByCountry !== undefined)
          this.groupByCountry = settings.groupByCountry;
        if (settings.enableClashUI !== undefined)
          this.enableClashUI = settings.enableClashUI;
        if (settings.externalController !== undefined)
          this.externalController = settings.externalController;
        if (settings.externalUiDownloadUrl !== undefined)
          this.externalUiDownloadUrl = settings.externalUiDownloadUrl;
        if (settings.ruleProviderFormat !== undefined)
          this.ruleProviderFormat = settings.ruleProviderFormat;
        if (settings.configType !== undefined)
          this.configType = settings.configType;
        if (settings.configEditor !== undefined)
          this.configEditor = settings.configEditor;
        if (settings.keywordGroups !== undefined)
          this.keywordGroups = settings.keywordGroups;
        if (settings.includeCountries !== undefined)
          this.includeCountries = settings.includeCountries;
        if (settings.customShortCode !== undefined)
          this.customShortCode = settings.customShortCode;
        if (settings.accordionSections !== undefined)
          this.accordionSections = settings.accordionSections;

        if (
          settings.customRules !== undefined &&
          Array.isArray(settings.customRules)
        ) {
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent("restore-custom-rules", {
                detail: { rules: settings.customRules },
              }),
            );
          }, 50);
        }
      },

      toggleAccordion(section) {
        this.accordionSections[section] = !this.accordionSections[section];
      },

      applyPredefinedRule() {
        if (this.selectedPredefinedRule === "custom") return;

        // PREDEFINED_RULE_SETS will be injected globally
        const rules = window.PREDEFINED_RULE_SETS;
        if (rules && rules[this.selectedPredefinedRule]) {
          this.selectedRules = rules[this.selectedPredefinedRule];
        }
      },

      resetConfigValidation() {
        this.configValidationState = "";
        this.configValidationMessage = "";
      },

      async saveBaseConfig() {
        const content = (this.configEditor || "").trim();
        if (!content) {
          alert(
            this.configContentRequiredText ||
              window.APP_TRANSLATIONS.configContentRequired,
          );
          return;
        }

        let payloadContent = this.configEditor;
        if (this.configType === "surge") {
          try {
            const { configObject } = parseSurgeConfigInput(this.configEditor);
            payloadContent = JSON.stringify(configObject);
          } catch (parseError) {
            const prefix =
              window.APP_TRANSLATIONS.configValidationError ||
              "Config validation error:";
            alert(`${prefix} ${parseError?.message || ""}`.trim());
            return;
          }
        }

        this.savingConfig = true;
        try {
          const response = await fetch("/config", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: this.configType,
              content: payloadContent,
            }),
          });
          const responseText = await response.text();
          if (!response.ok) {
            throw new Error(
              responseText || response.statusText || "Request failed",
            );
          }
          const configId = responseText.trim();
          if (!configId) {
            throw new Error("Missing config ID");
          }
          this.currentConfigId = configId;
          this.updateConfigIdInUrl(configId);

          const successMessage =
            window.APP_TRANSLATIONS.saveConfigSuccess ||
            "Configuration saved successfully!";
          alert(`${successMessage}\nID: ${configId}`);
        } catch (error) {
          console.error("Failed to save base config:", error);
          const errorPrefix =
            this.configSaveFailedText ||
            window.APP_TRANSLATIONS.configSaveFailed ||
            "Failed to save configuration";
          alert(`${errorPrefix}: ${error?.message || "Unknown error"}`);
        } finally {
          this.savingConfig = false;
        }
      },

      validateBaseConfig() {
        const content = (this.configEditor || "").trim();
        if (!content) {
          this.configValidationState = "error";
          this.configValidationMessage =
            this.configContentRequiredText ||
            window.APP_TRANSLATIONS.configContentRequired;
          return;
        }

        try {
          if (this.configType === "clash") {
            if (!window.jsyaml || !window.jsyaml.load) {
              throw new Error(
                window.APP_TRANSLATIONS.parserUnavailable ||
                  "Parser unavailable. Please refresh and try again.",
              );
            }
            window.jsyaml.load(content);
            this.configValidationState = "success";
            this.configValidationMessage =
              window.APP_TRANSLATIONS.validYamlConfig || "YAML config is valid";
          } else if (this.configType === "surge") {
            parseSurgeConfigInput(this.configEditor);
            this.configValidationState = "success";
            this.configValidationMessage =
              window.APP_TRANSLATIONS.validJsonConfig || "JSON config is valid";
          } else {
            JSON.parse(content);
            this.configValidationState = "success";
            this.configValidationMessage =
              window.APP_TRANSLATIONS.validJsonConfig || "JSON config is valid";
          }
        } catch (error) {
          this.configValidationState = "error";
          const prefix =
            window.APP_TRANSLATIONS.configValidationError ||
            "Config validation error: ";
          this.configValidationMessage = `${prefix}${error?.message || ""}`;
        }
      },

      clearBaseConfig() {
        if (confirm(window.APP_TRANSLATIONS.confirmClearConfig)) {
          this.configEditor = "";
          localStorage.removeItem("configEditor");
          this.currentConfigId = "";
          this.updateConfigIdInUrl(null);
        }
      },

      clearAll() {
        if (confirm(window.APP_TRANSLATIONS.confirmClearAll)) {
          this.input = "";
          this.selectedRules = [];
          this.selectedPredefinedRule = "balanced";
          this.applyPredefinedRule();
          this.groupByCountry = false;
          this.enableClashUI = false;
          this.externalController = "";
          this.externalUiDownloadUrl = "";
          this.ruleProviderFormat = "yaml";
          this.keywordGroups = [];
          this.generatedLinks = null;
          this.shortenedLinks = null;
          this.customShortCode = "";
          this.configEditor = "";

          // Clear all related localStorage items
          const keysToRemove = [
            "inputTextarea",
            "advancedToggle",
            "groupByCountry",
            "enableClashUI",
            "externalController",
            "externalUiDownloadUrl",
            "ruleProviderFormat",
            "configEditor",
            "configType",
            "customShortCode",
            "accordionSections",
            "keywordGroups",
            "selectedRules",
            "selectedPredefinedRule",
            "customRules",
          ];
          keysToRemove.forEach((key) => localStorage.removeItem(key));

          // Clear custom rules component
          window.dispatchEvent(
            new CustomEvent("restore-custom-rules", {
              detail: { rules: [] },
            }),
          );
        }
      },

      // 关键词分组管理方法
      addKeywordGroup() {
        this.keywordGroups.push({
          name: "",
          emoji: "",
          keywords: [],
          type: "select",
          includeDirect: false,
        });
      },

      removeKeywordGroup(index) {
        this.keywordGroups.splice(index, 1);
      },

      addKeyword(groupIndex, keyword) {
        if (!keyword || !keyword.trim()) return;
        if (!this.keywordGroups[groupIndex].keywords) {
          this.keywordGroups[groupIndex].keywords = [];
        }
        const trimmedKeyword = keyword.trim();
        if (!this.keywordGroups[groupIndex].keywords.includes(trimmedKeyword)) {
          this.keywordGroups[groupIndex].keywords.push(trimmedKeyword);
        }
      },

      removeKeyword(groupIndex, keywordIndex) {
        this.keywordGroups[groupIndex].keywords.splice(keywordIndex, 1);
      },

      toggleEmojiPicker(index) {
        if (this.showEmojiPicker === index) {
          this.showEmojiPicker = null;
        } else {
          this.showEmojiPicker = index;
        }
      },

      selectEmoji(groupIndex, emoji) {
        this.keywordGroups[groupIndex].emoji = emoji;
        this.showEmojiPicker = null;
      },

      exportConfig() {
        const customRulesInput = document.querySelector(
          'input[name="customRules"]',
        );
        const customRules =
          customRulesInput && customRulesInput.value
            ? JSON.parse(customRulesInput.value)
            : [];

        const config = {
          version: 1,
          timestamp: new Date().toISOString(),
          settings: {
            input: this.input,
            selectedRules: this.selectedRules,
            selectedPredefinedRule: this.selectedPredefinedRule,
            customRules: customRules,
            groupByCountry: this.groupByCountry,
            enableClashUI: this.enableClashUI,
            externalController: this.externalController,
            externalUiDownloadUrl: this.externalUiDownloadUrl,
            ruleProviderFormat: this.ruleProviderFormat,
            configType: this.configType,
            configEditor: this.configEditor,
            keywordGroups: this.keywordGroups,
            customShortCode: this.customShortCode,
            accordionSections: this.accordionSections,
          },
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sublink-config-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },

      async importConfig(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!confirm(window.APP_TRANSLATIONS.importConfigConfirm)) {
          event.target.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const config = JSON.parse(e.target.result);
            if (!config.settings) {
              throw new Error("Invalid config format");
            }

            const settings = config.settings;

            // Update component state (watchers will update localStorage)
            if (settings.input !== undefined) this.input = settings.input;
            if (settings.selectedRules !== undefined)
              this.selectedRules = settings.selectedRules;
            if (settings.selectedPredefinedRule !== undefined)
              this.selectedPredefinedRule = settings.selectedPredefinedRule;
            if (settings.groupByCountry !== undefined)
              this.groupByCountry = settings.groupByCountry;
            if (settings.enableClashUI !== undefined)
              this.enableClashUI = settings.enableClashUI;
            if (settings.externalController !== undefined)
              this.externalController = settings.externalController;
            if (settings.externalUiDownloadUrl !== undefined)
              this.externalUiDownloadUrl = settings.externalUiDownloadUrl;
            if (settings.ruleProviderFormat !== undefined)
              this.ruleProviderFormat = settings.ruleProviderFormat;
            if (settings.configType !== undefined)
              this.configType = settings.configType;
            if (settings.configEditor !== undefined)
              this.configEditor = settings.configEditor;
            if (settings.keywordGroups !== undefined)
              this.keywordGroups = settings.keywordGroups;
            if (settings.customShortCode !== undefined)
              this.customShortCode = settings.customShortCode;
            if (settings.accordionSections !== undefined)
              this.accordionSections = settings.accordionSections;

            // Special handling for customRules
            if (
              settings.customRules !== undefined &&
              Array.isArray(settings.customRules)
            ) {
              window.dispatchEvent(
                new CustomEvent("restore-custom-rules", {
                  detail: { rules: settings.customRules },
                }),
              );
            }

            alert(window.APP_TRANSLATIONS.importConfigSuccess);
          } catch (error) {
            console.error("Import failed:", error);
            alert(
              window.APP_TRANSLATIONS.invalidConfigFormat +
                ": " +
                error.message,
            );
          } finally {
            event.target.value = "";
          }
        };
        reader.readAsText(file);
      },

      updateConfigIdInUrl(configId) {
        const url = new URL(window.location.href);
        if (configId) {
          url.searchParams.set("configId", configId);
        } else {
          url.searchParams.delete("configId");
        }
        window.history.replaceState(
          {},
          "",
          `${url.pathname}${url.search}${url.hash}`,
        );
      },

      async submitForm() {
        this.loading = true;
        this.shortenedLinks = null; // Reset shortened links when generating new links
        try {
          // Get custom rules from the child component via the hidden input
          const customRulesInput = document.querySelector(
            'input[name="customRules"]',
          );
          const customRules =
            customRulesInput && customRulesInput.value
              ? JSON.parse(customRulesInput.value)
              : [];

          // Construct URLs
          const origin = window.location.origin;
          const params = new URLSearchParams();
          params.append("config", this.input);
          params.append("selectedRules", JSON.stringify(this.selectedRules));
          params.append("customRules", JSON.stringify(customRules));

          if (this.groupByCountry) params.append("group_by_country", "true");
          if (this.enableClashUI) params.append("enable_clash_ui", "true");
          if (this.externalController)
            params.append("external_controller", this.externalController);
          if (this.externalUiDownloadUrl)
            params.append(
              "external_ui_download_url",
              this.externalUiDownloadUrl,
            );
          if (this.keywordGroups && this.keywordGroups.length > 0)
            params.append("keyword_groups", JSON.stringify(this.keywordGroups));
          if (this.includeCountries && this.includeCountries.length > 0)
            params.append(
              "include_countries",
              JSON.stringify(this.includeCountries),
            );
          if (this.ruleProviderFormat)
            params.append("rule_provider_format", this.ruleProviderFormat);

          // Add configId if present in URL
          const urlParams = new URLSearchParams(window.location.search);
          const configId = this.currentConfigId || urlParams.get("configId");
          if (configId) {
            params.append("configId", configId);
          }

          const queryString = params.toString();

          this.generatedLinks = {
            xray: origin + "/xray?" + queryString,
            clash: origin + "/clash?" + queryString,
            surge: origin + "/surge?" + queryString,
            quanx: origin + "/quanx?" + queryString,
          };

          // Scroll to results
          setTimeout(() => {
            const resultsDiv = document.querySelector(".mt-12");
            if (resultsDiv) {
              resultsDiv.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);
        } catch (error) {
          console.error("Error generating links:", error);
          alert(window.APP_TRANSLATIONS.errorGeneratingLinks);
        } finally {
          this.loading = false;
        }
      },

      async shortenLinks() {
        // Check if links are already shortened
        if (this.shortenedLinks) {
          alert(window.APP_TRANSLATIONS.alreadyShortened);
          return;
        }

        if (!this.generatedLinks) {
          return;
        }

        this.shortening = true;
        try {
          const origin = window.location.origin;
          const shortened = {};

          // Use custom short code if provided, otherwise let backend generate it once
          let shortCode = this.customShortCode.trim();
          let isFirstRequest = true;

          // Shorten each link type
          for (const [type, url] of Object.entries(this.generatedLinks)) {
            try {
              let apiUrl = `${origin}/shorten-v2?url=${encodeURIComponent(url)}`;

              // For the first request, either use custom code or let backend generate
              // For subsequent requests, use the code from first request
              if (shortCode) {
                apiUrl += `&shortCode=${encodeURIComponent(shortCode)}`;
              }

              const response = await fetch(apiUrl);
              if (!response.ok) {
                throw new Error(`Failed to shorten ${type} link`);
              }
              const returnedCode = await response.text();

              // If this is the first request and no custom code was provided,
              // use the backend-generated code for all subsequent requests
              if (isFirstRequest && !shortCode) {
                shortCode = returnedCode;
              }
              isFirstRequest = false;

              // Map types to their corresponding path prefixes
              const prefixMap = {
                xray: "x",
                clash: "c",
                surge: "s",
                quanx: "q",
              };

              shortened[type] = `${origin}/${prefixMap[type]}/${returnedCode}`;
            } catch (error) {
              console.error(`Error shortening ${type} link:`, error);
              throw error;
            }
          }

          this.shortenedLinks = shortened;
        } catch (error) {
          console.error("Error shortening links:", error);
          alert(window.APP_TRANSLATIONS.shortenFailed);
        } finally {
          this.shortening = false;
        }
      },

      // Handle input change with debounce
      handleInputChange(val) {
        // Clear previous timer
        if (this.parseDebounceTimer) {
          clearTimeout(this.parseDebounceTimer);
        }

        // If input is empty, don't try to parse
        if (!val || !val.trim()) {
          return;
        }

        // Debounce for 500ms
        this.parseDebounceTimer = setTimeout(() => {
          this.tryParseSubscriptionUrl(val.trim());
        }, 500);
      },

      // Check if input looks like a subscription URL
      isSubscriptionUrl(text) {
        // Check if it's a single line URL (not multiple lines)
        if (text.includes("\n")) {
          return false;
        }

        try {
          const url = new URL(text);
          // Check if it matches our short link pattern: /[bcxsq]/[code]
          const pathMatch = url.pathname.match(
            /^\/([cxsq])\/([a-zA-Z0-9_-]+)$/,
          );
          if (pathMatch) {
            return true;
          }

          // Check if it's a full subscription URL with query params
          const fullMatch = url.pathname.match(
            /^\/(clash|xray|surge|quanx)$/,
          );
          if (fullMatch && url.search) {
            return true;
          }

          return false;
        } catch {
          return false;
        }
      },

      // Try to parse subscription URL
      async tryParseSubscriptionUrl(text) {
        if (!this.isSubscriptionUrl(text)) {
          return;
        }

        this.parsingUrl = true;
        try {
          let urlToParse;

          try {
            urlToParse = new URL(text);
          } catch {
            return;
          }

          // Check if it's a short link
          const shortMatch = urlToParse.pathname.match(
            /^\/([cxsq])\/([a-zA-Z0-9_-]+)$/,
          );

          if (shortMatch) {
            // It's a short link, resolve it first
            const response = await fetch(
              `/resolve?url=${encodeURIComponent(text)}`,
            );
            if (!response.ok) {
              console.warn("Failed to resolve short URL");
              return;
            }

            const data = await response.json();
            if (!data.originalUrl) {
              console.warn("No original URL returned");
              return;
            }

            urlToParse = new URL(data.originalUrl);
          }

          // Now parse the full URL and populate form
          this.populateFormFromUrl(urlToParse);

          // Show a success message
          const message =
            window.APP_TRANSLATIONS?.urlParsedSuccess ||
            "已成功解析订阅链接配置";
          console.log(message);
        } catch (error) {
          console.error("Error parsing subscription URL:", error);
        } finally {
          this.parsingUrl = false;
        }
      },

      // Populate form fields from parsed URL
      populateFormFromUrl(url) {
        const params = new URLSearchParams(url.search);

        // Extract config (the original subscription URLs)
        const config = params.get("config");
        if (config) {
          this.input = config;
        }

        // Extract selectedRules
        const selectedRules = params.get("selectedRules");
        if (selectedRules) {
          try {
            const parsed = JSON.parse(selectedRules);
            if (Array.isArray(parsed)) {
              this.selectedRules = parsed;
              this.selectedPredefinedRule = "custom";
            }
          } catch (e) {
            console.warn("Failed to parse selectedRules:", e);
          }
        }

        // Extract customRules
        const customRules = params.get("customRules");
        if (customRules) {
          try {
            const parsed = JSON.parse(customRules);
            if (Array.isArray(parsed) && parsed.length > 0) {
              // Dispatch custom event for CustomRules component to listen
              window.dispatchEvent(
                new CustomEvent("restore-custom-rules", {
                  detail: { rules: parsed },
                }),
              );
            }
          } catch (e) {
            console.warn("Failed to parse customRules:", e);
          }
        }

        // Extract other parameters
        this.groupByCountry = params.get("group_by_country") === "true";
        this.enableClashUI = params.get("enable_clash_ui") === "true";

        const externalController = params.get("external_controller");
        if (externalController) {
          this.externalController = externalController;
        }

        const externalUiDownloadUrl = params.get("external_ui_download_url");
        if (externalUiDownloadUrl) {
          this.externalUiDownloadUrl = externalUiDownloadUrl;
        }

        const ruleProviderFormat = params.get("rule_provider_format");
        if (ruleProviderFormat) {
          this.ruleProviderFormat = ruleProviderFormat;
        }

        const configId = params.get("configId");
        if (configId) {
          this.currentConfigId = configId;
          this.updateConfigIdInUrl(configId);
        }

        // Expand advanced options if any advanced settings are present
        if (
          selectedRules ||
          customRules ||
          this.groupByCountry ||
          this.enableClashUI ||
          externalController ||
          externalUiDownloadUrl ||
          ruleProviderFormat ||
          configId
        ) {
          this.showAdvanced = true;
        }
      },
    };
  };
};
