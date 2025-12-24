/** @jsxRuntime automatic */
/** @jsxImportSource hono/jsx */
import { APP_NAME, DOCS_URL } from '../constants.js';

export const Navbar = ({ t }) => {
    return (
        <nav class="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 z-50 transition-all duration-300">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <a href="#" class="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                        <img src="/favicon.svg" alt={`${APP_NAME} logo`} class="w-6 h-6" />
                        <span>{APP_NAME}</span>
                    </a>
                    <div class="flex items-center gap-3">
                        {/* Config Management Dropdown */}
                        <div x-data="{ open: false }" class="relative">
                            <button
                                {...{'x-on:click': 'open = !open'}}
                                {...{'x-on:click.outside': 'open = false'}}
                                class="px-4 py-2 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 group"
                                {...{'x-bind:class': "open ? 'bg-gray-100 dark:bg-gray-800' : ''"}}
                            >
                                <div class="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                                    <i class="fas fa-cog text-xs"></i>
                                </div>
                                <span class="hidden sm:inline">{t('configManagement')}</span>
                                <i class="fas fa-chevron-down text-xs text-gray-400 transition-transform duration-200" {...{'x-bind:class': "open ? 'rotate-180 text-gray-600 dark:text-gray-300' : ''"}}></i>
                            </button>

                            <div
                                x-cloak
                                x-show="open"
                                {...{'x-transition:enter': 'transition ease-out duration-200'}}
                                {...{'x-transition:enter-start': 'transform opacity-0 scale-95 translate-y-1'}}
                                {...{'x-transition:enter-end': 'transform opacity-100 scale-100 translate-y-0'}}
                                {...{'x-transition:leave': 'transition ease-in duration-150'}}
                                {...{'x-transition:leave-start': 'transform opacity-100 scale-100 translate-y-0'}}
                                {...{'x-transition:leave-end': 'transform opacity-0 scale-95 translate-y-1'}}
                                class="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 focus:outline-none overflow-hidden ring-1 ring-black/5"
                            >
                                {/* Header */}
                                <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        {t('configManagement') || 'Configuration'}
                                    </h3>
                                </div>
                                
                                <div class="p-2 space-y-1">
                                    <button
                                        {...{'x-on:click': "window.dispatchEvent(new CustomEvent('export-config')); open = false"}}
                                        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors group"
                                    >
                                        <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <i class="fas fa-download text-xs"></i>
                                        </div>
                                        <span>{t('exportConfig')}</span>
                                    </button>
                                    <button
                                        {...{'x-on:click': "window.dispatchEvent(new CustomEvent('import-config')); open = false"}}
                                        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors group"
                                    >
                                        <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <i class="fas fa-upload text-xs"></i>
                                        </div>
                                        <span>{t('importConfig')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Profile Dropdown */}
                        <div x-data="{ open: false }" class="relative">
                            <button
                                {...{'x-on:click': 'open = !open'}}
                                {...{'x-on:click.outside': 'open = false'}}
                                class="px-4 py-2 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 group"
                                {...{'x-bind:class': "open ? 'bg-gray-100 dark:bg-gray-800' : ''"}}
                            >
                                <div class="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                                    <i class="fas fa-folder text-xs"></i>
                                </div>
                                <span class="hidden sm:inline">{t('profiles')}</span>
                                <i class="fas fa-chevron-down text-xs text-gray-400 transition-transform duration-200" {...{'x-bind:class': "open ? 'rotate-180 text-gray-600 dark:text-gray-300' : ''"}}></i>
                            </button>

                            <div
                                x-cloak
                                x-show="open"
                                {...{'x-transition:enter': 'transition ease-out duration-200'}}
                                {...{'x-transition:enter-start': 'transform opacity-0 scale-95 translate-y-1'}}
                                {...{'x-transition:enter-end': 'transform opacity-100 scale-100 translate-y-0'}}
                                {...{'x-transition:leave': 'transition ease-in duration-150'}}
                                {...{'x-transition:leave-start': 'transform opacity-100 scale-100 translate-y-0'}}
                                {...{'x-transition:leave-end': 'transform opacity-0 scale-95 translate-y-1'}}
                                class="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 focus:outline-none overflow-hidden ring-1 ring-black/5"
                            >
                                {/* Header */}
                                <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
                                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        {t('savedProfiles') || 'Saved Profiles'}
                                    </h3>
                                    <span class="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700" x-text="$store.profiles.list.length"></span>
                                </div>

                                {/* List */}
                                <div class="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                                    <template {...{'x-for': '(profile, index) in $store.profiles.list', ':key': 'index'}}>
                                        <div class="group relative flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all duration-200 border border-transparent hover:border-gray-100 dark:hover:border-gray-700/50">
                                            {/* Icon */}
                                            <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                                                <i class="fas fa-file-code"></i>
                                            </div>

                                            {/* Content */}
                                            <button
                                                {...{'x-on:click': "window.dispatchEvent(new CustomEvent('load-profile', {detail: profile})); open = false"}}
                                                class="flex-1 text-left min-w-0"
                                            >
                                                <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" x-text="profile.name"></h4>
                                                <div class="flex items-center gap-2 mt-0.5">
                                                    <span class="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                                                        <i class="far fa-clock text-[9px]"></i>
                                                        <span x-text="new Date(profile.timestamp).toLocaleString()"></span>
                                                    </span>
                                                </div>
                                            </button>

                                            {/* Action */}
                                            <button
                                                {...{'x-on:click.stop': "if(confirm(window.APP_TRANSLATIONS ? window.APP_TRANSLATIONS.deleteProfileConfirm : 'Delete this profile?')) $store.profiles.remove(index)"}}
                                                class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200"
                                                title="Delete"
                                            >
                                                <i class="fas fa-trash-alt text-xs"></i>
                                            </button>
                                        </div>
                                    </template>
                                    
                                    <div x-show="$store.profiles.list.length === 0" class="py-12 px-4 text-center">
                                        <div class="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-gray-100 dark:border-gray-800/50">
                                            <i class="fas fa-folder-open text-2xl text-gray-300 dark:text-gray-600"></i>
                                        </div>
                                        <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">{t('noProfiles') || 'No profiles yet'}</p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">
                                            {t('saveProfileTip') || 'Save your configuration to access it quickly later.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            class="px-4 py-2 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 group"
                            {...{'x-on:click': 'toggleDarkMode()'}}
                            aria-label="Toggle dark mode"
                        >
                            <div class="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-colors duration-300">
                                <i class="fas text-xs" {...{'x-bind:class': "darkMode ? 'fa-moon' : 'fa-sun'"}}></i>
                            </div>
                            <span class="hidden sm:inline" x-text="darkMode ? 'Dark' : 'Light'"></span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
