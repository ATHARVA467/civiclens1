import React from 'react';
import { useI18n } from '@/lib/i18n';
import { Languages } from 'lucide-react';
import { clsx } from 'clsx';

export const LanguageToggle: React.FC<{ isDark?: boolean; className?: string }> = ({
  isDark = false,
  className
}) => {
  const { lang, setLang } = useI18n();

  return (
    <div
      className={clsx(
        'inline-flex items-center rounded-lg p-1 text-xs font-medium border transition-colors',
        isDark
          ? 'bg-[#172332] border-[#304153] text-[#A8B5C1]'
          : 'bg-[#F0F2EF] border-[#E3E7E8] text-[#263442]',
        className
      )}
      role="group"
      aria-label="Language Selector"
    >
      <Languages className="w-3.5 h-3.5 mx-1.5 opacity-60" />
      <button
        type="button"
        onClick={() => setLang('en')}
        className={clsx(
          'px-2 py-1 rounded transition-all min-h-[32px] min-w-[32px]',
          lang === 'en'
            ? isDark
              ? 'bg-[#8EA8C2] text-[#111A24] font-semibold shadow-sm'
              : 'bg-white text-[#294563] font-semibold shadow-soft-sm'
            : isDark
              ? 'hover:text-white'
              : 'hover:text-[#294563]'
        )}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('kn')}
        className={clsx(
          'px-2 py-1 rounded transition-all min-h-[32px] min-w-[32px] font-kannada',
          lang === 'kn'
            ? isDark
              ? 'bg-[#8EA8C2] text-[#111A24] font-semibold shadow-sm'
              : 'bg-white text-[#294563] font-semibold shadow-soft-sm'
            : isDark
              ? 'hover:text-white'
              : 'hover:text-[#294563]'
        )}
        aria-pressed={lang === 'kn'}
      >
        ಕನ್ನಡ
      </button>
    </div>
  );
};

