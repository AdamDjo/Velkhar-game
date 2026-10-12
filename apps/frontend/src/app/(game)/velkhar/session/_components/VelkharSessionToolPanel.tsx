import { useTranslations } from 'next-intl'

import { GameWindow } from '@/components/ui/velkhar/GameWindow/GameWindow'
import { cn } from '@/lib/utils'

import { VelkharCharacterSheet } from './VelkharCharacterSheet'
import { VelkharInventoryPanel } from './VelkharInventoryPanel'
import { VelkharSessionMenu } from './VelkharSessionMenu'
import { VelkharTravelJournal } from './VelkharTravelJournal'

import type {
  ActiveCondition,
  Character,
  InventoryItemRef,
  RunSnapshot,
  SurvivalStats,
} from '@velkhar/shared'

export type VelkharSessionTool = 'character' | 'inventory' | 'journal' | 'menu'

interface VelkharSessionToolPanelProps {
  character: Character
  conditions: ActiveCondition[]
  ending: boolean
  gold: number | null
  inventory: InventoryItemRef[]
  location: string
  narrative: string
  openTool: VelkharSessionTool | null
  onAbandon: () => Promise<void>
  onClose: () => void
  onInventoryAction: (item: InventoryItemRef, action: 'use' | 'equip' | 'unequip') => void
  run?: RunSnapshot | null
  survival: SurvivalStats
}

export function VelkharSessionToolPanel({
  character,
  conditions,
  ending,
  gold,
  inventory,
  location,
  narrative,
  onAbandon,
  onClose,
  onInventoryAction,
  openTool,
  run,
  survival,
}: VelkharSessionToolPanelProps) {
  const t = useTranslations('Session')
  if (!openTool) return null

  return (
    <GameWindow
      className={cn('velkhar-session-window', `velkhar-session-window--${openTool}`)}
      closeLabel={t('closePanel')}
      dismissLabel={t('closePanel')}
      label={
        openTool === 'inventory'
          ? t('inventoryPanel')
          : openTool === 'character'
            ? t('characterPanel')
            : openTool === 'journal'
              ? t('journalPanel')
              : t('sessionMenu')
      }
      onClose={onClose}
      title={
        openTool === 'inventory'
          ? t('fieldKit')
          : openTool === 'character'
            ? character.name
            : openTool === 'journal'
              ? t('travelJournal')
              : t('sessionMenu')
      }
    >
      {openTool === 'inventory' ? (
        <VelkharInventoryPanel gold={gold} items={inventory} onAction={onInventoryAction} />
      ) : null}

      {openTool === 'character' ? (
        <VelkharCharacterSheet character={character} conditions={conditions} survival={survival} />
      ) : null}

      {openTool === 'journal' ? (
        <VelkharTravelJournal location={location} narrative={narrative} run={run} />
      ) : null}

      {openTool === 'menu' ? (
        <VelkharSessionMenu ending={ending} onAbandon={onAbandon} onResume={onClose} />
      ) : null}
    </GameWindow>
  )
}
