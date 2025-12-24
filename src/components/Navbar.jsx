/** @jsxRuntime automatic */
/** @jsxImportSource hono/jsx */
import { APP_NAME, DOCS_URL } from '../constants.js';

export const Navbar = ({ t }) => {
    return (
        <nav class="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 z-50 transition-all duration-300">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <a href="#" class="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                        <img src="/favicon.ico" alt={`${APP_NAME} logo`} class="w-6 h-6" />
                        <span>{APP_NAME}</span>
                    </a>
                    <div class="flex items-center gap-3">
                        {/* Config Management Dropdown */}
                        <div x-data="{ open: false }" class="relative">
                            <button
                                {...{'x-on:click': 'open = !open'}}
                                {...{'x-on:click.outside': 'open = false'}}
                                class="px-4 py-2 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                            >
                                <i class="fas fa-cog"></i>
                                <span class="hidden sm:inline">{t('configManagement')}</span>
                                <i class="fas fa-chevron-down text-xs transition-transform duration-200" {...{'x-bind:class': "open ? 'rotate-180' : ''"}}></i>
                            </button>

                            <div
                                x-cloak
                                x-show="open"
                                {...{'x-transition:enter': 'transition ease-out duration-100'}}
                                {...{'x-transition:enter-start': 'transform opacity-0 scale-95'}}
                                {...{'x-transition:enter-end': 'transform opacity-100 scale-100'}}
                                {...{'x-transition:leave': 'transition ease-in duration-75'}}
                                {...{'x-transition:leave-start': 'transform opacity-100 scale-100'}}
                                {...{'x-transition:leave-end': 'transform opacity-0 scale-95'}}
                                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 focus:outline-none"
                            >
                                <button
                                    {...{'x-on:click': "window.dispatchEvent(new CustomEvent('export-config')); open = false"}}
                                    class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <i class="fas fa-download w-4"></i>
                                    <span>{t('exportConfig')}</span>
                                </button>
                                <button
                                    {...{'x-on:click': "window.dispatchEvent(new CustomEvent('import-config')); open = false"}}
                                    class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <i class="fas fa-upload w-4"></i>
                                    <span>{t('importConfig')}</span>
                                </button>
                            </div>
                        </div>

                        {/* Profile Dropdown */}
                        <div x-data="{ open: false }" class="relative">
                            <button
                                {...{'x-on:click': 'open = !open'}}
                                {...{'x-on:click.outside': 'open = false'}}
                                class="px-4 py-2 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                            >
                                <i class="fas fa-folder"></i>
                                <span class="hidden sm:inline">{t('profiles')}</span>
                                <i class="fas fa-chevron-down text-xs transition-transform duration-200" {...{'x-bind:class': "open ? 'rotate-180' : ''"}}></i>
                            </button>

                            <div
                                x-cloak
                                x-show="open"
                                {...{'x-transition:enter': 'transition ease-out duration-100'}}
                                {...{'x-transition:enter-start': 'transform opacity-0 scale-95'}}
                                {...{'x-transition:enter-end': 'transform opacity-100 scale-100'}}
                                {...{'x-transition:leave': 'transition ease-in duration-75'}}
                                {...{'x-transition:leave-start': 'transform opacity-100 scale-100'}}
                                {...{'x-transition:leave-end': 'transform opacity-0 scale-95'}}
                                class="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 focus:outline-none"
                            >
                                <div class="max-h-[60vh] overflow-y-auto custom-scrollbar p-2 space-y-1">
                                    <template {...{'x-for': '(profile, index) in $store.profiles.list', ':key': 'index'}}>
                                        <div class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                            <button
                                                {...{'x-on:click': "window.dispatchEvent(new CustomEvent('load-profile', {detail: profile})); open = false"}}
                                                class="flex-1 text-left flex flex-col overflow-hidden"
                                            >
                                                <span class="text-sm font-medium text-gray-700 dark:text-gray-200 truncate" x-text="profile.name"></span>
                                                <span class="text-[10px] text-gray-400" x-text="new Date(profile.timestamp).toLocaleString()"></span>
                                            </button>
                                            <button
                                                {...{'x-on:click.stop': "if(confirm(window.APP_TRANSLATIONS ? window.APP_TRANSLATIONS.deleteProfileConfirm : 'Delete this profile?')) $store.profiles.remove(index)"}}
                                                class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                title="Delete"
                                            >
                                                <i class="fas fa-trash-alt text-xs"></i>
                                            </button>
                                        </div>
                                    </template>
                                    
                                    <div x-show="$store.profiles.list.length === 0" class="py-8 text-center text-gray-400 text-sm">
                                        <div class="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <i class="fas fa-folder-open text-xl opacity-50"></i>
                                        </div>
                                        <p>{t('noProfiles') || 'No profiles saved'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a
                            href={DOCS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="px-4 py-2 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <i class="fas fa-book"></i>
                            <span>Docs</span>
                        </a>
                        <button
                            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                            {...{'x-on:click': 'toggleDarkMode()'}}
                            aria-label="Toggle dark mode"
                        >
                            <i class="fas" {...{'x-bind:class': "darkMode ? 'fa-sun' : 'fa-moon'"}}></i>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
