'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { GameLink } from '@/components/ui/game-link'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { GameButton } from '@/components/ui/velkhar/GameButton/GameButton'
import { GameIcon } from '@/components/ui/velkhar/GameIcon/GameIcon'

import { VELKHAR_WORLD } from '../../_config/velkhar-world'

interface VelkharSessionMenuProps {
  ending: boolean
  onAbandon: () => Promise<void>
}

export function VelkharSessionMenu({ ending, onAbandon }: VelkharSessionMenuProps) {
  const t = useTranslations('Session')
  const [confirmingAbandon, setConfirmingAbandon] = useState(false)

  if (confirmingAbandon) {
    return (
      <div
        className="velkhar-session-menu__confirmation"
        role="alertdialog"
        aria-label={t('confirmAbandonLabel')}
      >
        <GameIcon decorative name="warning" size={64} />
        <h3>{t('abandonTitle')}</h3>
        <p>{t('abandonBody')}</p>
        <div className="velkhar-session-menu__confirmation-actions">
          <GameButton disabled={ending} onClick={() => setConfirmingAbandon(false)} variant="ghost">
            {t('keepPlaying')}
          </GameButton>
          <GameButton loading={ending} onClick={() => void onAbandon()} tone="danger">
            {t('confirmAbandon')}
          </GameButton>
        </div>
      </div>
    )
  }

  return (
    <div className="velkhar-session-menu">
      <div className="velkhar-session-menu__intro">
        <GameIcon decorative name="compass" size={48} />
        <p>{t('menuIntro')}</p>
      </div>

      <section
        className="velkhar-session-menu__section velkhar-session-menu__section--preferences"
        aria-labelledby="session-preferences-title"
      >
        <div className="velkhar-session-menu__heading">
          <GameIcon decorative name="quill" size={32} />
          <div>
            <h3 id="session-preferences-title">{t('menuPreferences')}</h3>
            <p>{t('menuPreferencesHint')}</p>
          </div>
        </div>
        <LanguageSwitcher variant="menu" />
      </section>

      <div className="velkhar-session-menu__routes">
        <section className="velkhar-session-menu__section" aria-labelledby="session-exit-title">
          <div className="velkhar-session-menu__heading">
            <GameIcon decorative name="hourglass" size={32} />
            <div>
              <h3 id="session-exit-title">{t('menuExit')}</h3>
              <p>{t('menuExitHint')}</p>
            </div>
          </div>
          <GameLink
            href={`${VELKHAR_WORLD.routes.aveugle}?return=run`}
            leadingIcon={<GameIcon decorative name="arrow" size={24} />}
            variant="secondary"
          >
            {t('returnBlindOne')}
          </GameLink>
        </section>

        <section
          className="velkhar-session-menu__section velkhar-session-menu__section--danger"
          aria-labelledby="session-abandon-title"
        >
          <div className="velkhar-session-menu__heading">
            <GameIcon decorative name="warning" size={32} />
            <div>
              <h3 id="session-abandon-title">{t('menuAbandon')}</h3>
              <p>{t('menuAbandonHint')}</p>
            </div>
          </div>
          <GameButton
            leadingIcon={<GameIcon decorative name="fire" size={24} />}
            onClick={() => setConfirmingAbandon(true)}
            tone="danger"
            variant="secondary"
          >
            {t('abandonRun')}
          </GameButton>
        </section>
      </div>
    </div>
  )
}
