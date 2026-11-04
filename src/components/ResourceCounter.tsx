import Icon, { type IconName } from './Icon'

type ResourceCounterProps = {
  icon: Extract<IconName, 'coin' | 'gem' | 'star'>
  label: string
  value: number
}

function ResourceCounter({ icon, label, value }: ResourceCounterProps) {
  return (
    <div className="resource-counter" aria-label={`${value} ${label}`}>
      <Icon className={`resource-counter__icon resource-counter__icon--${icon}`} name={icon} />
      <span className="resource-counter__value">{value}</span>
      <span className="resource-counter__add" aria-hidden="true">
        <Icon name="plus" />
      </span>
    </div>
  )
}

export default ResourceCounter
