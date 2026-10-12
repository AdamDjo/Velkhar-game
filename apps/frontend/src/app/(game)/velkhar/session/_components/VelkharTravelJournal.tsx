import { useTranslations } from 'next-intl'

import { GameIcon, type GameIconName } from '@/components/ui/velkhar/GameIcon/GameIcon'

import type { QuestDanger, QuestDuration, RunSnapshot } from '@velkhar/shared'

interface VelkharTravelJournalProps {
  location: string
  narrative: string
  run?: RunSnapshot | null
}

const DANGER_LABELS: Record<
  QuestDanger,
  'journalDangerEasy' | 'journalDangerMedium' | 'journalDangerHard'
> = {
  easy: 'journalDangerEasy',
  medium: 'journalDangerMedium',
  hard: 'journalDangerHard',
}

const DURATION_LABELS: Record<
  QuestDuration,
  'journalDurationShort' | 'journalDurationLong' | 'journalDurationMajor'
> = {
  short: 'journalDurationShort',
  long: 'journalDurationLong',
  major: 'journalDurationMajor',
}

function readLatestTrace(narrative: string): string {
  const paragraphs = narrative.split(/\n{2,}/).filter(Boolean)
  return paragraphs[paragraphs.length - 1] ?? narrative
}

function readJourneyState(run: RunSnapshot): {
  icon: GameIconName
  label: 'journalStateOngoing' | 'journalStateReturning' | 'journalStateSecured'
  state: 'ongoing' | 'returning' | 'secured'
} {
  if (run.objectiveSecured) {
    return { icon: 'trophy', label: 'journalStateSecured', state: 'secured' }
  }

  if (run.returnEngaged) {
    return { icon: 'arrow', label: 'journalStateReturning', state: 'returning' }
  }

  return { icon: 'compass', label: 'journalStateOngoing', state: 'ongoing' }
}

/** Player-facing trace of the active contract, without exposing hidden run progression. */
export function VelkharTravelJournal({ location, narrative, run }: VelkharTravelJournalProps) {
  const t = useTranslations('Session')
  const journeyState = run ? readJourneyState(run) : null

  return (
    <div className="velkhar-travel-journal">
      {run ? (
        <article className="velkhar-travel-journal__contract">
          <header className="velkhar-travel-journal__heading">
            <GameIcon decorative name="scroll" size={64} />
            <div>
              <p className="velkhar-session-window__eyebrow">{t('journalActiveContract')}</p>
              <h3>{run.contract.objective}</h3>
            </div>
          </header>

          {journeyState ? (
            <p className="velkhar-travel-journal__state" data-state={journeyState.state}>
              <GameIcon decorative name={journeyState.icon} size={24} />
              <span>{t(journeyState.label)}</span>
            </p>
          ) : null}

          <dl className="velkhar-travel-journal__details">
            <div>
              <dt>{t('journalDestination')}</dt>
              <dd>{run.contract.destination}</dd>
            </div>
            <div>
              <dt>{t('journalCommissioner')}</dt>
              <dd>{run.contract.commissioner}</dd>
            </div>
            <div>
              <dt>{t('journalReward')}</dt>
              <dd>{t('journalGoldReward', { count: run.contract.rewardGold })}</dd>
            </div>
          </dl>

          <div className="velkhar-travel-journal__marks" aria-label={t('journalContractMarks')}>
            <span>
              {t('journalDanger')}: {t(DANGER_LABELS[run.contract.danger])}
            </span>
            <span>
              {t('journalDuration')}: {t(DURATION_LABELS[run.contract.duration])}
            </span>
          </div>
        </article>
      ) : (
        <section className="velkhar-travel-journal__empty">
          <GameIcon decorative name="quill" size={64} />
          <div>
            <p className="velkhar-session-window__eyebrow">{t('journalUnbound')}</p>
            <h3>{t('journalNoContract')}</h3>
            <p>{t('journalNoContractBody')}</p>
          </div>
        </section>
      )}

      <section className="velkhar-travel-journal__trace" aria-labelledby="velkhar-latest-trace">
        <div className="velkhar-session-window__section-heading">
          <h3 id="velkhar-latest-trace">{t('journalLatestTrace')}</h3>
          <span>{location}</span>
        </div>
        <blockquote>{readLatestTrace(narrative)}</blockquote>
      </section>
    </div>
  )
}
