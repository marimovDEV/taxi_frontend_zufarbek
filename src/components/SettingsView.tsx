/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bot, Key, AtSign, CloudUpload, Sliders, Heading, Phone, Send, FileText, Save } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (updated: AppSettings) => void;
}

export default function SettingsView({ settings, onSaveSettings }: SettingsViewProps) {
  // Telegram Bot Configuration States
  const [botToken, setBotToken] = useState(settings.telegramBotToken);
  const [botUsername, setBotUsername] = useState(settings.telegramBotUsername);
  const [botName, setBotName] = useState(settings.telegramBotName);

  // System & Bot Contact States
  const [contactTitle, setContactTitle] = useState(settings.contactSectionTitle);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [contactTelegram, setContactTelegram] = useState(settings.contactTelegramUsername);
  const [contactNotes, setContactNotes] = useState(settings.contactAdditionalNotes);
  const [lastSaved, setLastSaved] = useState(settings.lastSavedTime || '22:45:30');

  // Trigger time update helper
  const getFormattedTime = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  const handleSaveTelegramBot = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTime = getFormattedTime();
    setLastSaved(updatedTime);
    onSaveSettings({
      ...settings,
      telegramBotToken: botToken,
      telegramBotUsername: botUsername,
      telegramBotName: botName,
      lastSavedTime: updatedTime,
    });
  };

  const handleSaveContactSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTime = getFormattedTime();
    setLastSaved(updatedTime);
    onSaveSettings({
      ...settings,
      contactSectionTitle: contactTitle,
      contactPhone,
      contactTelegramUsername: contactTelegram,
      contactAdditionalNotes: contactNotes,
      lastSavedTime: updatedTime,
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 1. Telegram Bot Konfiguratsiyasi Card */}
      <form onSubmit={handleSaveTelegramBot} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-xl transition-all duration-300">
        <div className="flex items-center gap-4 pb-5 border-b border-outline-variant/30 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-sm">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display-lg text-lg font-bold text-on-surface leading-tight">Telegram Bot Konfiguratsiyasi</h3>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">Asosiy bot API tokeni va identifikatsiya sozlamalari.</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Telegram Bot Token */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Telegram Bot Token (Muhim)
            </label>
            <div className="relative flex items-center bg-surface-container-low border border-outline-variant/50 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="pl-4 pr-3 text-outline flex items-center border-r border-outline-variant/20">
                <Key className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="Tokenni kiriting"
                className="w-full bg-transparent border-none py-3.5 px-4 text-xs font-mono font-bold text-on-surface focus:outline-none placeholder:text-outline/40"
              />
            </div>
          </div>

          {/* Bot Username & Name (2 Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bot Username */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Bot Username
              </label>
              <div className="relative flex items-center bg-surface-container-low border border-outline-variant/50 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="pl-4 pr-3 text-outline flex items-center border-r border-outline-variant/20 font-bold text-xs">
                  <AtSign className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={botUsername}
                  onChange={(e) => setBotUsername(e.target.value)}
                  placeholder="@bot_username"
                  className="w-full bg-transparent border-none py-3.5 px-4 text-xs font-bold text-on-surface focus:outline-none placeholder:text-outline/40"
                />
              </div>
            </div>

            {/* Bot Nomi */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                Bot Nomi
              </label>
              <div className="relative flex items-center bg-surface-container-low border border-outline-variant/50 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="pl-4 pr-3 text-outline flex items-center border-r border-outline-variant/20 gap-2">
                  <Bot className="w-4 h-4" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                </span>
                <input
                  type="text"
                  required
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="Bot nomini kiriting"
                  className="w-full bg-transparent border-none py-3.5 px-4 text-xs font-bold text-on-surface focus:outline-none placeholder:text-outline/40"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Action Button (Bottom Right) */}
        <div className="flex justify-end pt-5 border-t border-outline-variant/20 mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
          >
            <CloudUpload className="w-4 h-4" />
            <span>Saqlash va Yangilash</span>
          </button>
        </div>
      </form>

      {/* 2. Tizim & Bot Sozlamalari Card */}
      <form onSubmit={handleSaveContactSettings} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-xl transition-all duration-300">
        <div className="flex items-center gap-4 pb-5 border-b border-outline-variant/30 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/10 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 shadow-sm">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display-lg text-lg font-bold text-on-surface leading-tight">Tizim & Bot Sozlamalari</h3>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">Telegram botdagi "Aloqa bo'limi" ma'lumotlarini o'zgartiring.</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Section Title & Phone Number (2 Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bo'lim Sarlavhasi */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Bo'lim Sarlavhasi
              </label>
              <div className="relative flex items-center bg-surface-container-low border border-outline-variant/50 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="pl-4 pr-3 text-outline flex items-center border-r border-outline-variant/20 font-serif font-bold text-xs">
                  H
                </span>
                <input
                  type="text"
                  required
                  value={contactTitle}
                  onChange={(e) => setContactTitle(e.target.value)}
                  placeholder="Sarlavhani kiriting"
                  className="w-full bg-transparent border-none py-3.5 px-4 text-xs font-bold text-on-surface focus:outline-none placeholder:text-outline/40"
                />
              </div>
            </div>

            {/* Telefon Raqam */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Telefon Raqam
              </label>
              <div className="relative flex items-center bg-surface-container-low border border-outline-variant/50 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="pl-4 pr-3 text-outline flex items-center border-r border-outline-variant/20">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+998991234567"
                  className="w-full bg-transparent border-none py-3.5 px-4 text-xs font-mono font-bold text-on-surface focus:outline-none placeholder:text-outline/40"
                />
              </div>
            </div>
          </div>

          {/* Telegram Username */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Telegram Username
            </label>
            <div className="relative flex items-center bg-surface-container-low border border-outline-variant/50 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="pl-4 pr-3 text-outline flex items-center border-r border-outline-variant/20">
                <Send className="w-4 h-4 -rotate-12" />
              </span>
              <input
                type="text"
                required
                value={contactTelegram}
                onChange={(e) => setContactTelegram(e.target.value)}
                placeholder="@username"
                className="w-full bg-transparent border-none py-3.5 px-4 text-xs font-bold text-on-surface focus:outline-none placeholder:text-outline/40"
              />
            </div>
          </div>

          {/* Additional Notes Textarea */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Qo'shimcha Izoh (Matn)
            </label>
            <div className="relative flex bg-surface-container-low border border-outline-variant/50 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="pl-4 pr-3 pt-4 text-outline flex items-start border-r border-outline-variant/20">
                <FileText className="w-4 h-4" />
              </span>
              <textarea
                required
                rows={3}
                value={contactNotes}
                onChange={(e) => setContactNotes(e.target.value)}
                placeholder="Qo'shimcha izohlarni kiriting"
                className="w-full bg-transparent border-none py-3.5 px-4 text-xs font-bold text-on-surface focus:outline-none placeholder:text-outline/40 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar: Timestamp & Save Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-5 border-t border-outline-variant/20 mt-6 gap-4">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold select-none flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            Oxirgi marta yuklandi: {lastSaved}
          </p>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Saqlash</span>
          </button>
        </div>
      </form>
    </div>
  );
}
