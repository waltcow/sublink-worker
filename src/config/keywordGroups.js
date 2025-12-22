/**
 * Keyword-based node grouping configuration
 * Define custom keyword filters to automatically group nodes
 */

export const KEYWORD_GROUPS = [
	{
		name: 'Office',
		emoji: '🏢',
		keywords: ['office', 'Office', 'OFFICE', '办公'],
		type: 'select', // 'select' or 'urltest'
		includeDirect: true // Whether to include DIRECT option
	},
	{
		name: 'Gaming',
		emoji: '🎮',
		keywords: ['game', 'gaming', 'Game', 'Gaming', '游戏'],
		type: 'urltest',
		includeDirect: false
	},
	{
		name: 'Streaming',
		emoji: '📺',
		keywords: ['stream', 'netflix', 'youtube', 'hulu', '流媒体'],
		type: 'select',
		includeDirect: false
	},
	{
		name: 'AI',
		emoji: '🤖',
		keywords: ['ai', 'AI', 'gpt', 'GPT', 'claude', 'Claude'],
		type: 'select',
		includeDirect: false
	}
];

/**
 * Enable/disable keyword grouping globally
 */
export const KEYWORD_GROUPING_ENABLED = true;
