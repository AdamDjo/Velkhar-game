import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { GameHud } from '@/features/game-session/velkhar/GameHud/GameHud'

import type { InventoryItemRef, SurvivalStats } from '@velkhar/shared'

interface VelkharSurvivalHudProps {
  inventory: InventoryItemRef[]
  onOpenCharacter: () => void
  onOpenInventory: () => void
  onOpenJournal: () => void
  survival: SurvivalStats
}

/** Adapts the live session state to the same HUD used by the landing proof. */
export function VelkharSurvivalHud({
  inventory,
  onOpenCharacter,
  onOpenInventory,
  onOpenJournal,
  survival,
}: VelkharSurvivalHudProps) {
  const t = useTranslations('Session')

  return (
    <GameHud
      className="velkhar-survival-hud"
      labels={{
        region: t('hudLabel'),
        gauges: {
          blood: t('blood'),
          breath: t('breath'),
          hunger: t('hunger'),
          thirst: t('thirst'),
          calamine: t('calamine'),
        },
      }}
      survival={survival}
      toolLabel={t('sessionTools')}
      tools={[
        {
          id: 'inventory',
          icon: (
            <Image alt="" height={82} src="/encre-de-sel/icons/inventory-tile.webp" width={82} />
          ),
          label: t('openInventory', { count: inventory.length }),
          onClick: onOpenInventory,
        },
        {
          id: 'journal',
          icon: <Image alt="" height={82} src="/encre-de-sel/icons/journal-tile.webp" width={82} />,
          label: t('openJournal'),
          onClick: onOpenJournal,
        },
        {
          id: 'character',
          icon: (
            <Image alt="" height={82} src="/encre-de-sel/icons/character-tile.webp" width={82} />
          ),
          label: t('openCharacter'),
          onClick: onOpenCharacter,
        },
      ]}
    />
  )
}
