import React, {FC} from 'react'


type ToggleType = {
  value: boolean
  onChange: () => void
  children: React.ReactNode
}

export const Toggler: FC<ToggleType> = ({value, onChange, children}) => {

  return (
    <div style={{display: 'flex', flexDirection: 'row', margin:'auto'}}>
      <div>
        <label htmlFor="toggler">
          <input
            id="toggler"
            type="checkbox"
            onClick={onChange}
            checked={value}
            readOnly
          />
        </label>
      </div>
      <div>
        {children}
      </div>

    </div>

  )
}

