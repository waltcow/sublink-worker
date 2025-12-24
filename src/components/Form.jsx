/** @jsxRuntime automatic */
/** @jsxImportSource hono/jsx */
import { CustomRules } from './CustomRules.jsx';
import { TextareaWithActions } from './TextareaWithActions.jsx';
import { ValidatedTextarea } from './ValidatedTextarea.jsx';
import { formLogicFn } from './formLogic.js';
import { UNIFIED_RULES, PREDEFINED_RULE_SETS } from '../config/index.js';

const LINK_FIELDS = [
  { key: 'xray', labelKey: 'xrayLink' },
  { key: 'singbox', labelKey: 'singboxLink' },
  { key: 'clash', labelKey: 'clashLink' },
  { key: 'surge', labelKey: 'surgeLink' },
  { key: 'quanx', labelKey: 'quanxLink' }
];

export const Form = (props) => {
  const { t } = props;

  const translations = {
    processing: t('processing'),
    convert: t('convert'),
    saveConfigSuccess: t('saveConfigSuccess'),
    saveConfig: t('saveConfig'),
    savingConfig: t('savingConfig'),
    configContentRequired: t('configContentRequired'),
    configSaveFailed: t('configSaveFailed'),
    exportConfig: t('exportConfig'),
    importConfig: t('importConfig'),
    importConfigConfirm: t('importConfigConfirm'),
    importConfigSuccess: t('importConfigSuccess'),
    invalidConfigFormat: t('invalidConfigFormat'),
    confirmClearConfig: t('confirmClearConfig'),
    confirmClearAll: t('confirmClearAll'),
    errorGeneratingLinks: t('errorGeneratingLinks'),
    shortenLinks: t('shortenLinks'),
    shortening: t('shortening'),
    alreadyShortened: t('alreadyShortened'),
    shortenFailed: t('shortenFailed'),
    customShortCode: t('customShortCode'),
    optional: t('optional'),
    customShortCodePlaceholder: t('customShortCodePlaceholder'),
    showFullLinks: t('showFullLinks'),
    profiles: t('profiles'),
    profileNameRequired: t('profileNameRequired'),
    profileNamePlaceholder: t('profileNamePlaceholder'),
    saveProfile: t('saveProfile'),
    overwriteProfile: t('overwriteProfile'),
    profileSaved: t('profileSaved'),
    loadProfileConfirm: t('loadProfileConfirm'),
    deleteProfileConfirm: t('deleteProfileConfirm'),
    load: t('load'),
    delete: t('delete')
  };

  const scriptContent = `
    window.APP_TRANSLATIONS = ${JSON.stringify(translations)};
    window.PREDEFINED_RULE_SETS = ${JSON.stringify(PREDEFINED_RULE_SETS)};
    window.__name = window.__name || ((target, value) => target);
    (${formLogicFn.toString()})();
  `;

  return (
    <div x-data="formData()" x-init="init()" class="max-w-4xl mx-auto">
      <form {...{'x-on:submit.prevent': 'submitForm'}} class="space-y-8">

      {/* Input Section */}
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-md group">
        <TextareaWithActions
          id="input"
          name="input"
          label={t('shareUrls')}
          labelPrefix={
            <span class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <i class="fas fa-link text-sm"></i>
            </span>
          }
          model="input"
          rows={4}
          placeholder={t('urlPlaceholder')}
          required
          labelActionsWrapperClass="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          labelActions={[
            {
              key: 'paste',
              icon: 'fas fa-paste',
              label: t('paste'),
              hideLabelOnMobile: true,
              className:
                'px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1',
              title: t('paste'),
              attrs: {
                'x-on:click': "navigator.clipboard.readText().then(text => input = text).catch(() => {})"
              }
            },
            {
              key: 'clear',
              icon: 'fas fa-times',
              label: t('clear'),
              hideLabelOnMobile: true,
              className:
                'px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1',
              title: t('clear'),
              attrs: {
                'x-on:click': "input = ''",
                'x-show': 'input'
              }
            }
          ]}
        />
      </div>

      {/* Advanced Options Toggle */}
      <div 
        class="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" 
        {...{'x-on:click': 'showAdvanced = !showAdvanced'}}
        role="button"
        tabindex="0"
        {...{
          'x-on:keydown.enter.prevent': 'showAdvanced = !showAdvanced',
          'x-on:keydown.space.prevent': 'showAdvanced = !showAdvanced'
        }}
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
            <i class="fas fa-sliders-h"></i>
          </div>
          <span class="font-semibold text-gray-900 dark:text-white">{t('advancedOptions')}</span>
        </div>
        <div 
          class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 transition-transform duration-300" 
          {...{'x-bind:class': "{'rotate-180': showAdvanced}"}}
        >
          <i class="fas fa-chevron-down"></i>
        </div>
      </div>

  {/* Advanced Options Content */ }
  <div x-show="showAdvanced" {...{'x-transition:enter': 'transition ease-out duration-300', 'x-transition:enter-start': 'opacity-0 transform -translate-y-4', 'x-transition:enter-end': 'opacity-100 transform translate-y-0', 'x-transition:leave': 'transition ease-in duration-200', 'x-transition:leave-start': 'opacity-100 transform translate-y-0', 'x-transition:leave-end': 'opacity-0 transform -translate-y-4'}} class="space-y-6">

    {/* Rule Selection */ }
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <i class="fas fa-filter text-gray-400"></i>
          {t('ruleSelection')}
        </h3>
        <select x-model="selectedPredefinedRule" {...{'x-on:change': 'applyPredefinedRule()'}} class="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
        <option value="custom">{t('custom')}</option>
        <option value="minimal">{t('minimal')}</option>
        <option value="balanced">{t('balanced')}</option>
        <option value="comprehensive">{t('comprehensive')}</option>
      </select>
          </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {UNIFIED_RULES.map((rule) => (
      <label class="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group">
                  <input
                    type="checkbox"
                    value={rule.name}
                    x-model="selectedRules" 
                    {...{'x-on:change': "selectedPredefinedRule = 'custom'"}}
                    class="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                  />        <span class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
          {t(`outboundNames.${rule.name}`)}
        </span>
      </label>
    ))}
  </div>
          </div>

  {/* Custom Rules Component */ }
  <CustomRules t={t} />

    {/* General Options */ }
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <i class="fas fa-cog text-gray-400"></i>
              {t('generalSettings')}
            </h3>
            
            <div class="space-y-4">
              <label class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                <span class="font-medium text-gray-700 dark:text-gray-300">{t('groupByCountry')}</span>
                <div class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" x-model="groupByCountry" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </div>
              </label>

              <label class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                <span class="font-medium text-gray-700 dark:text-gray-300">{t('enableClashUI')}</span>
                <div class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" x-model="enableClashUI" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </div>
              </label>

              <div
                x-show="enableClashUI"
                {...{
                  'x-transition:enter': 'transition ease-out duration-200',
                  'x-transition:enter-start': 'opacity-0 transform -translate-y-2',
                  'x-transition:enter-end': 'opacity-100 transform translate-y-0',
                  'x-transition:leave': 'transition ease-in duration-150',
                  'x-transition:leave-start': 'opacity-100 transform translate-y-0',
                  'x-transition:leave-end': 'opacity-0 transform -translate-y-2'
                }}
                class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
              >
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('externalController')}</label>
                  <input type="text" x-model="externalController" class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder={t('externalControllerPlaceholder')} />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('externalUiDownloadUrl')}</label>
                  <input type="text" x-model="externalUiDownloadUrl" class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder={t('externalUiDownloadUrlPlaceholder')} />
                </div>
              </div>

          </div>
          </div>

  {/* 关键词自动分组 */}
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
            <i class="fas fa-tags"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{t('keywordGrouping')}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">根据关键词将节点自动分组，可结合分组类型快速测速或手选。</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="hidden sm:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1">
            <span class="flex items-center gap-1">
              <i class="fas fa-layer-group text-[10px]"></i>
              <span {...{'x-text': "keywordGroups.length"}}></span>
            </span>
            <span class="w-px h-3 bg-gray-200 dark:bg-gray-700"></span>
            <span class="flex items-center gap-1">
              <i class="fas fa-key text-[10px]"></i>
              <span {...{'x-text': "keywordGroups.reduce((sum, g) => sum + (g.keywords?.length || 0), 0)"}}></span>
            </span>
          </div>
          <button
            type="button"
            {...{'x-on:click': 'addKeywordGroup()'}}
            class="px-3 py-1.5 text-xs font-semibold bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors flex items-center gap-1.5"
          >
            <i class="fas fa-plus text-xs"></i>
            <span>{t('addGroup')}</span>
          </button>
        </div>
      </div>

      {/* 关键词分组列表 */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3" {...{'x-show': 'keywordGroups.length > 0'}}>
        <template {...{'x-for': '(group, groupIndex) in keywordGroups', 'x-bind:key': 'groupIndex'}}>
          <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-3">
            <div class="flex gap-2 items-start">
              <div class="flex-1 space-y-2">
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    {...{'x-on:click': 'toggleEmojiPicker(groupIndex)'}}
                    class="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span {...{'x-text': "keywordGroups[groupIndex].emoji || '🏢'"}}></span>
                  </button>
                  <input
                    type="text"
                    {...{'x-model': 'keywordGroups[groupIndex].name'}}
                    placeholder={t('groupNamePlaceholder')}
                    class="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div 
                  x-show="showEmojiPicker === groupIndex"
                  {...{'x-on:click.away': 'showEmojiPicker = null'}}
                  class="relative"
                >
                  <div class="absolute z-50 mt-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl w-64">
                    <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto p-1">
                      <template {...{'x-for': 'emoji in commonEmojis', 'x-bind:key': 'emoji'}}>
                        <button
                          type="button"
                          {...{'x-on:click': 'selectEmoji(groupIndex, emoji)'}}
                          class="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-sm"
                          {...{'x-text': 'emoji'}}
                        ></button>
                      </template>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <select
                    {...{'x-model': 'keywordGroups[groupIndex].type'}}
                    class="px-2.5 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="select">{t('select')}</option>
                    <option value="urltest">{t('urltest')}</option>
                  </select>
                  <label class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    <input
                      type="checkbox"
                      {...{'x-model': 'keywordGroups[groupIndex].includeDirect'}}
                      class="w-3 h-3 text-primary-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-primary-500"
                    />
                    <span>DIRECT</span>
                  </label>
                  <button
                    type="button"
                    {...{'x-on:click': 'removeKeywordGroup(groupIndex)'}}
                    class="ml-auto px-2.5 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-xs"
                    title={t('remove')}
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="flex gap-2 items-start">
              <div class="flex-1" {...{'x-data': "{ newKeyword: '' }"}}>
                <div class="flex gap-1 mb-2">
                  <input
                    type="text"
                    {...{'x-model': 'newKeyword'}}
                    {...{'x-on:keydown.enter.prevent': "if(newKeyword.trim()) addKeyword(groupIndex, newKeyword); newKeyword = '';"}}
                    placeholder={t('addKeywordPlaceholder')}
                    class="flex-1 px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    {...{'x-on:click': "if(newKeyword.trim()) addKeyword(groupIndex, newKeyword); newKeyword = '';"}}
                    class="px-3 py-2 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <template {...{'x-for': '(keyword, keywordIndex) in keywordGroups[groupIndex].keywords', 'x-bind:key': 'keywordIndex'}}>
                    <span class="inline-flex items-center gap-1.5 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-lg">
                      <span {...{'x-text': 'keyword'}}></span>
                      <button
                        type="button"
                        {...{'x-on:click': 'removeKeyword(groupIndex, keywordIndex)'}}
                        class="hover:text-primary-900 dark:hover:text-primary-100"
                      >
                        <i class="fas fa-times text-[10px]"></i>
                      </button>
                    </span>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      {/* 空状态 */}
      <div
        {...{'x-show': 'keywordGroups.length === 0'}}
        class="text-center py-6 text-gray-400 dark:text-gray-500 text-xs border border-dashed border-gray-200 dark:border-gray-700 rounded-xl"
      >
        <i class="fas fa-tags text-xl mb-1 opacity-50"></i>
        <p>{t('noKeywordGroups')}</p>
      </div>
    </div>
  </div>

  {/* Base Config */ }
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i class="fas fa-file-code text-gray-400"></i>
                {t('baseConfigSettings')}
              </h3>
              <select x-model="configType" class="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="singbox">SingBox (JSON)</option>
                <option value="clash">Clash (YAML)</option>
                <option value="surge">Surge (JSON/INI)</option>
              </select>
          </div>
            
            <ValidatedTextarea
              id="configEditor"
              name="configEditor"
              model="configEditor"
              rows={5}
              placeholder="Paste your custom config here..."
              variant="mono"
              containerClass="mt-0 group"
              labelWrapperClass="flex items-center justify-end mb-2"
              labelActionsWrapperClass="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              pasteLabel={t('paste')}
              clearLabel={t('clear')}
              validation={{
                button: {
                  key: 'validate-config',
                  label: t('validateConfig'),
                  className:
                    'px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2',
                  attrs: {
                    'x-on:click': 'validateBaseConfig()'
                  }
                },
                success: {
                  show: "configValidationState === 'success'",
                  textExpr: 'configValidationMessage'
                },
                error: {
                  show: "configValidationState === 'error'",
                  textExpr: 'configValidationMessage'
                }
              }}
              inlineActionsWrapperClass="absolute bottom-4 right-4 flex gap-2"
              preserveLabelSpace={false}
            />
            
            <div class="flex justify-end gap-3 mt-4">
              <button 
                type="button" 
                {...{'x-on:click': 'saveBaseConfig()'}}
                {...{'x-bind:disabled': 'savingConfig'}}
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <i class="fas" {...{'x-bind:class': "savingConfig ? 'fa-spinner fa-spin' : 'fa-save'"}}></i>
                <span x-text="savingConfig ? savingConfigText : saveConfigText">{t('saveConfig')}</span>
              </button>
              <button type="button" {...{'x-on:click': 'clearBaseConfig()'}} class="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium text-sm" >
  { t('clearConfig') }
              </button>
          </div>
          </div >

    {/* Profiles Management */}
    {/* Moved to Navbar */}
        </div>

  {/* Action Buttons */ }
  <div class="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            class="flex-1 py-3.5 px-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            {...{'x-bind:disabled': 'loading'}}
          >
            <i class="fas" {...{'x-bind:class': "loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'"}}></i>
            <span x-text="loading ? processingText : convertText">{t('convert')}</span>
          </button>

          <button
            type="button"
            {...{'x-on:click': "window.dispatchEvent(new CustomEvent('request-save-profile'))"}}
            class="px-6 py-3.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
          >
            <i class="fas fa-save"></i>
            <span>{t('saveProfile')}</span>
          </button>

          <button
            type="button"
            {...{'x-on:click': 'clearAll()'}}
            class="px-6 py-3.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
          >
            <i class="fas fa-trash-alt"></i>
            <span>{t('clear')}</span>
          </button>
        </div>

        {/* Hidden file input for config import */}
        <input
          type="file"
          x-ref="fileInput"
          class="hidden"
          accept=".json"
          {...{'x-on:change': 'importConfig($event)'}}
        />
      </form>

  {/* Results Section */ }
  <div x-cloak x-show="generatedLinks" x-data="{ copied: null }" {...{'x-transition:enter': 'transition ease-out duration-500', 'x-transition:enter-start': 'opacity-0 transform translate-y-8', 'x-transition:enter-end': 'opacity-100 transform translate-y-0'}} class="mt-12">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-all duration-300 hover:shadow-md">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span class="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
            <i class="fas fa-link text-sm"></i>
          </span>
          {t('subscriptionLinks')}
        </h2>
      </div>

      <div class="mt-6 space-y-4">
        {LINK_FIELDS.map((field) => (
          <div class="relative group" key={field.key}>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t(field.labelKey)}
            </label>
            <div class="flex gap-2">
              <input
                type="text"
                readonly
                {...{'x-bind:value': `shortenedLinks ? shortenedLinks?.${field.key} : generatedLinks?.${field.key}`}}
                class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:border-transparent transition-all duration-200 font-mono text-sm"
                {...{'x-bind:class': "shortenedLinks ? 'text-primary-600 dark:text-primary-400 font-semibold focus:ring-primary-500' : 'text-gray-600 dark:text-gray-400 focus:ring-green-500'"}}
              />
              <button
                type="button"
                {...{'x-on:click': `navigator.clipboard.writeText((shortenedLinks || generatedLinks)?.${field.key}); copied = '${field.key}'; setTimeout(() => copied = null, 2000)`}}
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                {...{'x-bind:class': `{
                  'hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400': !shortenedLinks,
                  'hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400': shortenedLinks,
                  'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400': !shortenedLinks && copied === '${field.key}',
                  'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400': shortenedLinks && copied === '${field.key}'
                }`}}
              >
                <i class="fas" {...{'x-bind:class': `copied === '${field.key}' ? 'fa-check' : 'fa-copy'`}}></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shortening Controls */}
      <div class="mt-6">
        <div class="flex flex-col items-center gap-3">
          <div class="w-full max-w-md">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
              {t('customShortCode')} <span class="text-gray-400">({t('optional')})</span>
            </label>
            <input
              type="text"
              x-model="customShortCode"
              placeholder={t('customShortCodePlaceholder')}
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-center"
            />
          </div>
        </div>
        <div class="flex justify-center mt-4">
          <button
            type="button"
            {...{'x-on:click': "shortenedLinks ? shortenedLinks = null : shortenLinks()"}}
            {...{'x-bind:disabled': "!shortenedLinks && shortening"}}
            class="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
            {...{'x-bind:class': "shortenedLinks ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm' : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-primary-500/30 hover:shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed'"}}
          >
            <i
              class="fas"
              {...{'x-bind:class': "shortenedLinks ? 'fa-expand-alt' : (shortening ? 'fa-spinner fa-spin' : 'fa-compress-alt')"}}
            ></i>
            <span
              x-text="shortenedLinks ? showFullLinksText : (shortening ? shorteningText : shortenLinksText)"
            ></span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <script dangerouslySetInnerHTML={{ __html: scriptContent }} />
    </div>
  );
};
