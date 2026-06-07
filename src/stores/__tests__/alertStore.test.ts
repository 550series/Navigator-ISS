import { describe, it, expect, beforeEach } from 'vitest'
import { useAlertStore } from '../alertStore'

describe('alertStore', () => {
  beforeEach(() => {
    useAlertStore.setState({
      alerts: [],
      filter: { level: [], category: [], status: [] },
    })
  })

  it('adds alert', () => {
    const { addAlert } = useAlertStore.getState()
    addAlert({
      level: 'warning',
      source: 'test',
      message: 'test alert',
      category: 'system',
    })

    const { alerts } = useAlertStore.getState()
    expect(alerts).toHaveLength(1)
    expect(alerts[0].level).toBe('warning')
    expect(alerts[0].message).toBe('test alert')
  })

  it('acknowledges alert', () => {
    const { addAlert } = useAlertStore.getState()
    addAlert({
      level: 'info',
      source: 'test',
      message: 'test',
      category: 'system',
    })

    const { alerts } = useAlertStore.getState()
    const alertId = alerts[0].id

    useAlertStore.getState().acknowledgeAlert(alertId)
    const updatedAlerts = useAlertStore.getState().alerts
    expect(updatedAlerts[0].acknowledged).toBe(true)
  })

  it('resolves alert', () => {
    const { addAlert } = useAlertStore.getState()
    addAlert({
      level: 'critical',
      source: 'test',
      message: 'test',
      category: 'system',
    })

    const { alerts } = useAlertStore.getState()
    const alertId = alerts[0].id

    useAlertStore.getState().resolveAlert(alertId, 'Fixed')
    const updatedAlerts = useAlertStore.getState().alerts
    expect(updatedAlerts[0].resolvedAt).toBeDefined()
    expect(updatedAlerts[0].resolution).toBe('Fixed')
  })

  it('filters alerts by level', () => {
    const { addAlert } = useAlertStore.getState()
    addAlert({ level: 'warning', source: 'test', message: '1', category: 'system' })
    addAlert({ level: 'critical', source: 'test', message: '2', category: 'system' })
    addAlert({ level: 'info', source: 'test', message: '3', category: 'system' })

    useAlertStore.setState({ filter: { level: ['warning'], category: [], status: [] } })
    const filtered = useAlertStore.getState().getFilteredAlerts()
    expect(filtered).toHaveLength(1)
    expect(filtered[0].level).toBe('warning')
  })

  it('gets stats', () => {
    const { addAlert } = useAlertStore.getState()
    addAlert({ level: 'warning', source: 'test', message: '1', category: 'system' })
    addAlert({ level: 'critical', source: 'test', message: '2', category: 'system' })

    const stats = useAlertStore.getState().getStats()
    expect(stats.total).toBe(2)
    expect(stats.warning).toBe(1)
    expect(stats.critical).toBe(1)
    expect(stats.unacknowledged).toBe(2)
  })
})
