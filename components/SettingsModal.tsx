import React, { useState } from 'react';
import { Settings, AIProvider } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { OPENROUTER_DEFAULT_TEXT_MODEL } from '../constants';

interface SettingsModalProps {
    currentSettings: Settings;
    onSave: (settings: Settings) => void;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ currentSettings, onSave, onClose }) => {
    const [settings, setSettings] = useState<Settings>(currentSettings);

    const handleSave = () => {
        onSave(settings);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-base-200 border border-base-300 rounded-2xl shadow-2xl max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-base-300 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-content-100">Settings</h2>
                    <button onClick={onClose} className="text-content-300 hover:text-content-100">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    {/* Provider Selection */}
                    <div>
                        <label className="block text-lg font-medium text-content-100 mb-2">AI Provider</label>
                        <div className="flex space-x-2 rounded-lg bg-base-300 p-1">
                            {(['gemini', 'openai', 'openrouter'] as AIProvider[]).map(provider => (
                                <button
                                    key={provider}
                                    onClick={() => setSettings(s => ({ ...s, provider }))}
                                    className={`w-full text-center px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${settings.provider === provider ? 'bg-brand-primary text-white' : 'text-content-200 hover:bg-base-100'}`}
                                >
                                    {provider.charAt(0).toUpperCase() + provider.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* API Keys */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-content-200" htmlFor="gemini-key">Gemini API Key</label>
                            <input
                                id="gemini-key"
                                type="password"
                                value={settings.apiKeys.gemini}
                                onChange={e => setSettings(s => ({ ...s, apiKeys: { ...s.apiKeys, gemini: e.target.value } }))}
                                className="mt-1 w-full p-2 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-content-100"
                                placeholder="Enter your Google AI Studio key"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-content-200" htmlFor="openai-key">OpenAI API Key</label>
                            <input
                                id="openai-key"
                                type="password"
                                value={settings.apiKeys.openai}
                                onChange={e => setSettings(s => ({ ...s, apiKeys: { ...s.apiKeys, openai: e.target.value } }))}
                                className="mt-1 w-full p-2 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-content-100"
                                placeholder="Enter your OpenAI API key"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-content-200" htmlFor="openrouter-key">OpenRouter API Key</label>
                            <input
                                id="openrouter-key"
                                type="password"
                                value={settings.apiKeys.openrouter}
                                onChange={e => setSettings(s => ({ ...s, apiKeys: { ...s.apiKeys, openrouter: e.target.value } }))}
                                className="mt-1 w-full p-2 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-content-100"
                                placeholder="Enter your OpenRouter key"
                            />
                        </div>
                    </div>

                    {/* OpenRouter Specific Settings */}
                    {settings.provider === 'openrouter' && (
                        <div className="p-4 bg-base-300/50 rounded-lg border border-base-300">
                             <label className="block text-sm font-medium text-content-200" htmlFor="openrouter-model">OpenRouter Model</label>
                             <input
                                id="openrouter-model"
                                type="text"
                                value={settings.openRouterModel}
                                onChange={e => setSettings(s => ({ ...s, openRouterModel: e.target.value }))}
                                className="mt-1 w-full p-2 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-content-100"
                                placeholder={OPENROUTER_DEFAULT_TEXT_MODEL}
                            />
                            <p className="text-xs text-content-300 mt-2">
                                E.g., `anthropic/claude-3-sonnet`, `mistralai/mistral-large`, etc. See OpenRouter docs for model IDs.
                            </p>
                            <p className="text-xs text-content-300">
                              Tip: Economy mode trims context and may be faster/cheaper. Premium uses richer context for highest quality.
                            </p>
                        </div>
                    )}

                    {/* Performance Settings */}
                        <div className="p-4 bg-base-300/50 rounded-lg border border-base-300">
                          <h3 className="text-lg font-semibold text-content-100 mb-3">Performance</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-content-200">Mode</label>
                              <select
                                value={settings.performance?.mode || 'balanced'}
                                onChange={(e) => setSettings(s => ({
                                  ...s,
                                  performance: { ...(s.performance || {}), mode: e.target.value as any }
                                }))}
                                className="mt-1 w-full p-2 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-content-100"
                              >
                                <option value="economy">Economy</option>
                                <option value="balanced">Balanced</option>
                                <option value="premium">Premium</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-content-200">Max URLs per run</label>
                              <input
                                type="number"
                                min={1}
                                value={settings.performance?.maxUrlsPerRun ?? ''}
                                onChange={(e) => {
                                  const n = Number(e.target.value);
                                  setSettings(s => ({
                                    ...s,
                                    performance: { ...(s.performance || {}), maxUrlsPerRun: isNaN(n) ? undefined : Math.max(1, Math.floor(n)) }
                                  }))
                                }}
                                className="mt-1 w-full p-2 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-content-100"
                                placeholder="default"
                                title="Guardrail to keep runs fast and protect API limits."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-content-200">Concurrency (override)</label>
                              <input
                                type="number"
                                min={1}
                                value={settings.performance?.concurrency ?? ''}
                                onChange={(e) => {
                                  const n = Number(e.target.value);
                                  setSettings(s => ({
                                    ...s,
                                    performance: { ...(s.performance || {}), concurrency: isNaN(n) ? undefined : Math.max(1, Math.floor(n)) }
                                  }))
                                }}
                                className="mt-1 w-full p-2 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-content-100"
                                placeholder="default"
                                title="Override max parallel AI calls. Higher = faster but may hit rate limits."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-content-200">Micro-batch size (OpenRouter)</label>
                              <input
                                type="number"
                                min={1}
                                value={settings.performance?.microBatchSize ?? ''}
                                onChange={(e) => {
                                  const n = Number(e.target.value);
                                  setSettings(s => ({
                                    ...s,
                                    performance: { ...(s.performance || {}), microBatchSize: isNaN(n) ? undefined : Math.max(1, Math.floor(n)) }
                                  }))
                                }}
                                className="mt-1 w-full p-2 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-content-100"
                                placeholder="default"
                                title="OpenRouter only. Groups small URL chunks to smooth call bursts."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-content-200">Essence truncate (chars)</label>
                              <input
                                type="number"
                                min={500}
                                step={100}
                                value={settings.performance?.essenceTruncate ?? ''}
                                onChange={(e) => {
                                  const n = Number(e.target.value);
                                  setSettings(s => ({
                                    ...s,
                                    performance: { ...(s.performance || {}), essenceTruncate: isNaN(n) ? undefined : Math.max(200, Math.floor(n)) }
                                  }))
                                }}
                                className="mt-1 w-full p-2 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-content-100"
                                placeholder="default"
                                title="Chars per URL used to extract essence. Lower = cheaper but may reduce quality."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-content-200">Post context truncate (chars)</label>
                              <input
                                type="number"
                                min={1000}
                                step={100}
                                value={settings.performance?.postTruncate ?? ''}
                                onChange={(e) => {
                                  const n = Number(e.target.value);
                                  setSettings(s => ({
                                    ...s,
                                    performance: { ...(s.performance || {}), postTruncate: isNaN(n) ? undefined : Math.max(800, Math.floor(n)) }
                                  }))
                                }}
                                className="mt-1 w-full p-2 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-content-100"
                                placeholder="default"
                                title="Chars per URL included for post generation context. Higher = richer but costs more."
                              />
                            </div>
                          </div>
                        </div>

                        {/* Guardrails */}
                        <div className="p-4 bg-base-300/50 rounded-lg border border-base-300">
                          <h3 className="text-lg font-semibold text-content-100 mb-3">Guardrails</h3>
                          <div className="space-y-4">
                            <label className="inline-flex items-center gap-2 text-sm text-content-200">
                              <input
                                type="checkbox"
                                checked={!!settings.guardrails?.enforceOpenRouterAllowlist}
                                onChange={(e) => setSettings(s => ({
                                  ...s,
                                  guardrails: { ...(s.guardrails || {}), enforceOpenRouterAllowlist: e.target.checked }
                                }))}
                              />
                              Enforce OpenRouter Model Allowlist
                            </label>
                            <div>
                              <label className="block text-sm font-medium text-content-200 mb-2">Allowed Models (comma separated)</label>
                              <input
                                type="text"
                                value={(settings.guardrails?.openRouterAllowlist || []).join(', ')}
                                onChange={(e) => setSettings(s => ({
                                  ...s,
                                  guardrails: { ...(s.guardrails || {}), openRouterAllowlist: e.target.value.split(',').map(x => x.trim()).filter(Boolean) }
                                }))}
                                className="w-full p-2 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-content-100"
                                placeholder="anthropic/claude-3-haiku-20240307, openai/gpt-4o-mini, ..."
                              />
                            </div>
                          </div>
                        </div>
                    </div>
                {/* Inline validation messages */}
                <div className="px-6 pb-4 text-xs text-content-300">
                  {settings.performance?.concurrency !== undefined && settings.performance.concurrency < 1 && (
                    <div className="text-red-400">Concurrency must be at least 1.</div>
                  )}
                  {settings.performance?.microBatchSize !== undefined && settings.performance.microBatchSize < 1 && (
                    <div className="text-red-400">Micro-batch size must be at least 1.</div>
                  )}
                  {settings.performance?.essenceTruncate !== undefined && settings.performance.essenceTruncate < 200 && (
                    <div className="text-yellow-400">Essence truncate is very low; consider 500+ for quality.</div>
                  )}
                  {settings.performance?.postTruncate !== undefined && settings.performance.postTruncate < 1000 && (
                    <div className="text-yellow-400">Post context truncate is very low; consider 1500+ for quality.</div>
                  )}
                  {settings.provider === 'openrouter' && settings.guardrails?.enforceOpenRouterAllowlist && (settings.guardrails.openRouterAllowlist || []).length > 0 && !((settings.guardrails.openRouterAllowlist || []).includes(settings.openRouterModel)) && (
                    <div className="text-red-400">Selected OpenRouter model is not in the allowlist.</div>
                  )}
                </div>
                <div className="p-4 bg-base-300/50 border-t border-base-300 flex justify-end space-x-3">
                     <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-content-200 hover:bg-base-100 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-blue-600 transition-colors">
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};
