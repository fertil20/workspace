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
            <img src={home} id="TooltipHome" width={25} height={25} alt='Home'/>
            <Tooltip placement="bottom" isOpen={tooltipOpen} target="TooltipHome" toggle={toggle}>
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
            <img src={working} id="TooltipAtWork" width={25} height={25} alt='Work'/>
            <Tooltip placement="bottom" isOpen={tooltipOpen} target="TooltipAtWork" toggle={toggle}>
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
            <img src={ill} id="TooltipIll" width={25} height={25} alt='Ill'/>
            <Tooltip placement="bottom" isOpen={tooltipOpen} target="TooltipIll" toggle={toggle}>
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
            <img src={sunbed} id="TooltipHoliday" width={25} height={25} alt='Holiday'/>
            <Tooltip placement="bottom" isOpen={tooltipOpen} target="TooltipHoliday" toggle={toggle}>
                В отпуске
                с 00.00.0000 до 00.00.0000
                Замещающий ААААААА А.А.
            </Tooltip>
        </div>
    );
}

