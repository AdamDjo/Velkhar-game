const openingScene = {
  activeConditions: [],
  gold: 12,
  notifications: [],
  run: {
    atSurface: false,
    canDescend: true,
    contract: {
      commissioner: 'The Blind One',
      danger: 'medium',
      destination: 'Well of Glass',
      duration: 'short',
      failureConditions: ['ledger-destroyed'],
      family: 'recovery',
      id: 'contract-well',
      objective: 'Bring back the sealed water ledger',
      rewardGold: 80,
      successCondition: 'water-ledger-secured',
      targetDurationMinutes: 45,
    },
    currentDepth: 1,
    estimatedRemainingMinutes: 37,
    intensityTag: 'brief',
    maxDepthReached: 1,
    mode: 'exploration',
    objectiveSecured: false,
    powerGapProjection: {
      contractWeight: 6,
      deathIntensity: 'brutal',
      deathTurn: 4,
      gap: -1,
      killTurn: 3,
      powerScore: 5,
      registry: 'hard',
      rewardMultiplier: 1,
    },
    returnEngaged: false,
    returnEstimate: {
      estimatedMinutes: 8,
      foodNeeded: 0,
      remainingRooms: 1,
      risk: 'safe',
      suppliesShort: false,
      waterNeeded: 1,
    },
  },
  scene: {
    choices: [
      {
        id: 'listen',
        riskLevel: 'safe',
        text: 'Listen to the salt wind',
        type: 'action',
      },
      {
        id: 'follow',
        riskLevel: 'medium',
        text: 'Follow the marks toward the well',
        type: 'action',
      },
    ],
    id: 'opening-road',
    location: 'Salt Road',
    narrative:
      'Salt moves across the road in thin white ribbons. A figure waits beside the dry well.',
    sessionId: 'session-layout-test',
  },
  source: 'ai',
  survival: {
    calamine: 18,
    empriseCharges: 2,
    energy: 76,
    hp: 19,
    hunger: 61,
    isDying: false,
    maxHp: 24,
    neglectStreak: 0,
    thirst: 43,
  },
  updatedInventory: [],
  updatedStats: {
    calamine: 18,
    energy: 76,
    hp: 19,
    hunger: 61,
    maxHp: 24,
    thirst: 43,
  },
}

const sessionViewports = [
  { height: 650, name: 'small laptop', width: 1280 },
  { height: 844, name: 'mobile', width: 390 },
] as const

function expectAuthFrame(selector: string) {
  cy.get(selector)
    .should('be.visible')
    .then(($surface) => {
      expect(getComputedStyle($surface[0]).borderImageSource).to.contain('input-frame.webp')
    })
}

function expectUnifiedWindow(selector: string) {
  expectAuthFrame(`${selector} .game-window`)
  cy.get(`${selector} .game-window__header`).then(($header) => {
    expect(getComputedStyle($header[0], '::after').display).to.equal('none')
  })
}

describe('Game Session Encre de Sel', () => {
  for (const viewport of sessionViewports) {
    it(`reprend la preuve gameplay sur ${viewport.name}`, () => {
      cy.viewport(viewport.width, viewport.height)
      cy.intercept('POST', '/api/game/session', {
        body: { data: openingScene, success: true },
        statusCode: 200,
      }).as('openSession')

      cy.visit('/velkhar/session/resume')
      cy.wait('@openSession')

      cy.get('.game-scene-layout').should('exist')
      cy.get('.game-scene__reader').should('contain.text', 'Salt Road')
      cy.get('.game-session-narrative').should('contain.text', 'Salt moves across the road')
      cy.get('.game-hud').should('exist')
      cy.get('.game-hud [role="progressbar"]').should('have.length', 5)

      cy.get('.game-session-hud__tools .inventory-slot').eq(0).click()
      cy.get('.velkhar-session-window--inventory [role="dialog"]').should('be.visible')
      expectUnifiedWindow('.velkhar-session-window--inventory')
      cy.get('.velkhar-session-window--inventory .game-window__header button').click()

      cy.get('.game-session-hud__tools .inventory-slot').eq(1).click()
      cy.get('.velkhar-session-window--journal [role="dialog"]').should('be.visible')
      cy.get('.velkhar-travel-journal').should('contain.text', 'Bring back the sealed water ledger')
      expectUnifiedWindow('.velkhar-session-window--journal')
      cy.get('.velkhar-session-window--journal .game-window__header button').click()

      cy.get('.game-session-hud__tools .inventory-slot').eq(2).click()
      cy.get('.velkhar-session-window--character [role="dialog"]').should('be.visible')
      expectUnifiedWindow('.velkhar-session-window--character')
      cy.get('.velkhar-session-window--character .game-window__header button').click()

      cy.contains('.velkhar-session__nav-group--tools button', 'Options').click()
      cy.get('.velkhar-session-window--menu [role="dialog"]').should('be.visible')
      expectUnifiedWindow('.velkhar-session-window--menu')
      cy.document().then((document) => {
        expect(document.documentElement.scrollWidth).to.be.at.most(viewport.width)
      })
    })
  }

  it('utilise aussi la coque d’accès quand la limite anonyme est atteinte', () => {
    cy.viewport(1280, 650)
    cy.intercept('POST', '/api/game/session', {
      body: { error: 'Anonymous limit reached', success: false },
      statusCode: 429,
    }).as('openLimitedSession')

    cy.visit('/velkhar/session/resume')
    cy.wait('@openLimitedSession')

    cy.get('[role="alert"].velkhar-session__state').should('be.visible')
    expectAuthFrame('.velkhar-session__state')
    cy.get('.velkhar-session__state .game-button').should('be.visible')
  })
})
