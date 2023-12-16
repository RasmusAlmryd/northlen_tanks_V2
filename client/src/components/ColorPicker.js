import ButtonGroup from "react-bootstrap/ButtonGroup"
import Button from "react-bootstrap/Button"

export default function({colors, usedColors, setColor}){
    const disabledBgColor = '#888888'
    const disabledBorderColor = '#ffffff'

    var buttons = colors.map(color => {

        if(usedColors.includes(color)){
            
            return <Button className='color-btn' key={color} variant='secondary' onClick={() => setColor(color)} style={{backgroundColor: disabledBgColor, borderColor: disabledBorderColor, width: '8px', height: '20px', borderWidth: '3px', padding: '0px'}}/>
        }

        return <Button className='color-btn' key={color} variant='secondary' onClick={() => setColor(color)} style={{backgroundColor: color, borderColor: color, witch: '20px', height: '20px'}}/>

        // let bgColor = usedColors.includes(color) ? disabledColor : color;
        // let borderColor = usedColors.includes(color) ? 'white': color
        // return <Button className='color-btn' key={color} variant='secondary' onClick={() => setColor(color)} style={{backgroundColor: bgColor, borderColor: borderColor, witch: '20px', height: '20px'}}/>
    })
    
    return (
        <ButtonGroup className="me-2" aria-label="First group">
            {buttons}
        </ButtonGroup>
    )
}