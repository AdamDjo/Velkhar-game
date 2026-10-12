import { ATTRIBUTE_LABELS, attributeModifier, getPeople, getVocation } from '@velkhar/shared'
import { useLocale, useTranslations } from 'next-intl'

import { GameIcon } from '@/components/ui/velkhar/GameIcon/GameIcon'

import { VelkharActiveConditions } from './VelkharActiveConditions'

import type { ActiveCondition, Character, SurvivalStats } from '@velkhar/shared'

interface VelkharCharacterSheetProps {
  character: Character
  conditions: ActiveCondition[]
  survival: SurvivalStats
}

const ATTRIBUTE_ORDER = ['blood', 'breath', 'will'] as const

const SURVIVAL_ICON = {
  health: 'blood-drop',
  thirst: 'water',
  hunger: 'hunger',
  fatigue: 'wind',
  calamine: 'crystals',
} as const

export function VelkharCharacterSheet({
  character,
  conditions,
  survival,
}: VelkharCharacterSheetProps) {
  const locale = useLocale()
  const t = useTranslations('Session')
  const people = getPeople(character.people)
  const vocation = getVocation(character.vocation)
  const survivalStats = [
    {
      id: 'health',
      icon: SURVIVAL_ICON.health,
      label: t('health'),
      max: survival.maxHp,
      value: survival.hp,
      valueLabel: `${survival.hp}/${survival.maxHp}`,
    },
    {
      id: 'thirst',
      icon: SURVIVAL_ICON.thirst,
      label: t('thirst'),
      max: 100,
      value: survival.thirst,
      valueLabel: `${survival.thirst}%`,
    },
    {
      id: 'hunger',
      icon: SURVIVAL_ICON.hunger,
      label: t('hunger'),
      max: 100,
      value: survival.hunger,
      valueLabel: `${survival.hunger}%`,
    },
    {
      id: 'fatigue',
      icon: SURVIVAL_ICON.fatigue,
      label: t('fatigue'),
      max: 100,
      value: 100 - survival.energy,
      valueLabel: `${100 - survival.energy}%`,
    },
    {
      id: 'calamine',
      icon: SURVIVAL_ICON.calamine,
      label: t('calamine'),
      max: 100,
      value: survival.calamine,
      valueLabel: `${survival.calamine}%`,
    },
  ]

  return (
    <div className="velkhar-character-sheet">
      <header className="velkhar-character-sheet__identity">
        <div className="velkhar-character-sheet__portrait" aria-hidden="true">
          <GameIcon decorative name="stranger" size={96} />
        </div>
        <div className="velkhar-character-sheet__nameplate">
          <p className="velkhar-session-window__eyebrow">{t('characterIdentity')}</p>
          <h3>{character.name}</h3>
          <p>
            {people?.name[locale] ?? character.people} ·{' '}
            {vocation?.name[locale] ?? character.vocation}
          </p>
          {character.backstory ? (
            <blockquote className="velkhar-session-window__story">{character.backstory}</blockquote>
          ) : null}
        </div>
      </header>

      <div className="velkhar-character-sheet__ledger">
        <section
          className="velkhar-character-sheet__triptych"
          aria-labelledby="velkhar-attributes-title"
        >
          <p className="velkhar-session-window__eyebrow">{t('innerNature')}</p>
          <h4 id="velkhar-attributes-title">{t('triptych')}</h4>
          <dl className="velkhar-session-window__attributes">
            {ATTRIBUTE_ORDER.map((attribute) => {
              const value = character.stats.attributes[attribute]
              const modifier = attributeModifier(value)
              return (
                <div key={attribute} data-attribute={attribute}>
                  <dt>{ATTRIBUTE_LABELS[attribute][locale]}</dt>
                  <dd>
                    {value} <small>{modifier >= 0 ? `+${modifier}` : modifier}</small>
                  </dd>
                </div>
              )
            })}
          </dl>
        </section>

        <section
          className="velkhar-character-sheet__survival-panel"
          aria-labelledby="velkhar-survival-title"
        >
          <p className="velkhar-session-window__eyebrow">{t('roadToll')}</p>
          <h4 id="velkhar-survival-title">{t('survival')}</h4>
          <dl className="velkhar-character-sheet__survival">
            {survivalStats.map((stat) => (
              <div
                key={stat.id}
                data-danger={stat.id === 'calamine' && survival.calamine >= 75}
                data-stat={stat.id}
              >
                <GameIcon decorative name={stat.icon} size={24} />
                <dt>{stat.label}</dt>
                <dd>{stat.valueLabel}</dd>
                <progress aria-label={stat.label} max={stat.max} value={stat.value} />
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section
        className="velkhar-character-sheet__conditions"
        aria-labelledby="velkhar-conditions-title"
      >
        <div>
          <p className="velkhar-session-window__eyebrow">{t('currentMarks')}</p>
          <h4 id="velkhar-conditions-title">{t('conditions')}</h4>
        </div>
        <VelkharActiveConditions conditions={conditions} variant="sheet" />
      </section>
    </div>
  )
}
