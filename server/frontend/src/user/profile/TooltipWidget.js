import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';
import working from '../../media/working.png'
import sunbed from '../../media/sunbed.png'
import ill from '../../media/ill.png'
import home from '../../media/home.png'

export const TooltipWidgetHome = () => {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);

    return (
        <div>
            <img src={home} id="Tooltip" width={25} height={25} alt={Tooltip}/>
            <Tooltip placement="bottom" isOpen={tooltipOpen} target="Tooltip" toggle={toggle}>
                Работает дома
            </Tooltip>
        </div>
    );
}

export const TooltipWidgetAtWork = () => {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);

    return (
        <div>
            <img src={working} id="Tooltip" width={25} height={25} alt={Tooltip}/>
            <Tooltip placement="bottom" isOpen={tooltipOpen} target="Tooltip" toggle={toggle}>
                Работает в офисе
            </Tooltip>
        </div>
    );
}

export const TooltipWidgetIll = () => {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);

    return (
        <div>
            <img src={ill} id="Tooltip" width={25} height={25} alt={Tooltip}/>
            <Tooltip placement="bottom" isOpen={tooltipOpen} target="Tooltip" toggle={toggle}>
                На больничном
                с 00.00.0000
            </Tooltip>
        </div>
    );
}

export const TooltipWidgetHoliday = () => {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);

    return (
        <div>
            <img src={sunbed} id="Tooltip" width={25} height={25} alt={Tooltip}/>
            <Tooltip placement="bottom" isOpen={tooltipOpen} target="Tooltip" toggle={toggle}>
                В отпуске
                с 00.00.0000 до 00.00.0000
                Замещающий ААААААА А.А.
            </Tooltip>
        </div>
    );
}

