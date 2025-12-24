/** @jsxRuntime automatic */
/** @jsxImportSource hono/jsx */

export const CustomRules = (props) => {
    const { t } = props;

    return (
        <div x-data="customRulesData()" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex flex-col gap-3 mb-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                            <i class="fas fa-stream"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{t('customRulesSection')}</h3>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('customRulesSectionTooltip')}</p>
                        </div>
                    </div>
                    <div class="hidden sm:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1">
                        <span class="flex items-center gap-1">
                            <i class="fas fa-layer-group text-[10px]"></i>
                            <span {...{'x-text': 'rules.length'}}></span>
                        </span>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <p class="text-sm text-gray-500 dark:text-gray-400">{t('customRulesSectionTooltip')}</p>
                    <div class="flex gap-2 w-full sm:w-auto">
                        <button type="button" {...{'x-on:click': 'addRule()'}} class="flex-1 sm:flex-none px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors duration-200 font-medium flex items-center justify-center gap-2">
                            <i class="fas fa-plus"></i>
                            {t('addCustomRule')}
                        </button>
                        <button type="button" {...{'x-on:click': 'clearAll()'}} x-show="rules.length > 0" class="flex-1 sm:flex-none px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors duration-200 font-medium flex items-center justify-center gap-2" >
                            <i class="fas fa-trash"></i>
                            { t('clearAll') }
                        </button>
                    </div>
                </div>
            </div>

    <div {...{'x-transition:enter': 'transition ease-out duration-300', 'x-transition:enter-start': 'opacity-0 transform scale-95', 'x-transition:enter-end': 'opacity-100 transform scale-100'}}>
        <template {...{'x-if': 'rules.length === 0'}}>
            <div class="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <i class="fas fa-plus text-2xl"></i>
                </div>
                <p class="text-gray-500 dark:text-gray-400 mb-4">{t('noCustomRulesForm')}</p>
                <button type="button" {...{'x-on:click': 'addRule()'}} class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 font-medium">
                {t('addCustomRule')}
            </button>
        </div>
        </template>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <template {...{'x-for': '(rule, index) in rules', 'x-bind:key': 'index'}}>
        <div
          x-data="{ show: false }"
          x-init="$nextTick(() => show = true)"
          x-show="show"
          class="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:border-primary-200 dark:hover:border-primary-900/50"
          {...{
            'x-transition:enter': 'transition ease-out duration-300',
            'x-transition:enter-start': 'opacity-0 -translate-y-2 scale-95',
            'x-transition:enter-end': 'opacity-100 translate-y-0 scale-100',
            'x-transition:leave': 'transition ease-in duration-200',
            'x-transition:leave-start': 'opacity-100 translate-y-0 scale-100',
            'x-transition:leave-end': 'opacity-0 translate-y-2 scale-95',
            'x-on:custom-rules-clear.window': 'show = false'
          }}
        >
            <div class="flex items-center gap-2 mb-3">
                <span class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-semibold" x-text="index + 1"></span>
                <div class="flex-1">
                    <p class="text-xs text-gray-500 dark:text-gray-400">{t('customRule')}</p>
                    <p class="text-sm text-gray-700 dark:text-gray-200" x-text="rule.name || t('customRuleOutboundName')"></p>
                </div>
                <button
                  type="button"
                  {...{'x-on:click': 'show = false; setTimeout(() => removeRule(index), 200)'}}
                  class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-xs flex items-center gap-1"
                >
                  <i class="fas fa-trash"></i>
                  <span class="hidden sm:inline">{t('remove')}</span>
                </button>
            </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rule Name */}
            <div class="col-span-1 md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customRuleOutboundName')}
                </label>
                <div class="relative">
                    <input
                        type="text"
                        x-model="rule.name"
                        {...{'x-bind:list': "'outbound-list-' + index"}}
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="e.g., MyRule"
                    />
                    <datalist {...{'x-bind:id': "'outbound-list-' + index"}}>
                        <option value="DIRECT"></option>
                        <option value="REJECT"></option>
                        <template {...{'x-for': 'group in keywordGroups', 'x-bind:key': 'group.name'}}>
                            <option {...{'x-bind:value': "(group.emoji || '🏢') + ' ' + group.name"}}></option>
                        </template>
                    </datalist>
                </div>
            </div>

            {/* Domain Suffix */}
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customRuleDomainSuffix')}
                </label>
                <input
                    type="text"
                    x-model="rule.domain_suffix"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder={t('customRuleDomainSuffixPlaceholder')}
                />
            </div>

            {/* Domain Keyword */}
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customRuleDomainKeyword')}
                </label>
                <input
                    type="text"
                    x-model="rule.domain_keyword"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder={t('customRuleDomainKeywordPlaceholder')}
                />
            </div>

            {/* IP CIDR */}
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customRuleIPCIDR')}
                </label>
                <input
                    type="text"
                    x-model="rule.ip_cidr"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder={t('customRuleIPCIDRPlaceholder')}
                />
            </div>

            {/* Protocol */}
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                    {t('customRuleProtocol')}
                    <i class="fas fa-info-circle text-gray-400 hover:text-primary-500 cursor-help" title={t('customRuleProtocolTooltip')}></i>
                </label>
                <input
                    type="text"
                    x-model="rule.protocol"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder={t('customRuleProtocolPlaceholder')}
                />
            </div>

            {/* Geo-Site */}
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                    {t('customRuleGeoSite')}
                    <i class="fas fa-info-circle text-gray-400 hover:text-primary-500 cursor-help" title={t('customRuleGeoSiteTooltip')}></i>
                </label>
                <input
                    type="text"
                    x-model="rule.site"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder={t('customRuleGeoSitePlaceholder')}
                />
            </div>

            {/* Geo-IP */}
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                    {t('customRuleGeoIP')}
                    <i class="fas fa-info-circle text-gray-400 hover:text-primary-500 cursor-help" title={t('customRuleGeoIPTooltip')}></i>
                </label>
                <input
                    type="text"
                    x-model="rule.ip"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder={t('customRuleGeoIPPlaceholder')}
                />
            </div>
        </div>
    </div>
          </template>
        </div>
    </div>

    {/* Hidden input to store the final JSON for form submission */ }
    <input type="hidden" name="customRules" {...{'x-bind:value': 'JSON.stringify(rules)'}} />

        <script dangerouslySetInnerHTML={{
            __html: `
        function customRulesData() {
          return {
            rules: [],
            
            init() {
              // Watch for changes in rules to update JSON content and localStorage
              this.$watch('rules', (value) => {
                localStorage.setItem('customRules', JSON.stringify(value));
              });

              // Listen for custom event to restore rules from URL parsing
              window.addEventListener('restore-custom-rules', (event) => {
                if (event.detail && Array.isArray(event.detail.rules)) {
                  this.rules = event.detail.rules;
                }
              });
            },
            
            addRule() {
              this.rules.push({
                name: '',
                domain_suffix: '',
                domain_keyword: '',
                ip_cidr: '',
                protocol: '',
                site: '',
                ip: '',
                outbound: '' // Will be set to name by default in backend or needs explicit field? 
                             // In original logic, outbound name IS the rule name for custom rules.
              });
            },
            
            removeRule(index) {
              this.rules.splice(index, 1);
            },
            
            clearAll() {
              if (!confirm('${t('confirmClearAllRules')}')) {
                return;
              }
              
              this.$dispatch('custom-rules-clear');
              setTimeout(() => {
                this.rules = [];
              }, 200);
            }
          }
        }
      `}} />
    </div>
  );
};
