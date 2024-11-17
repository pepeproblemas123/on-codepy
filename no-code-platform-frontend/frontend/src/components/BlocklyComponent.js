import React, { useEffect, useRef } from 'react';
import Blockly from 'blockly/core';
import 'blockly/blocks';

const BlocklyComponent = () => {
    const blocklyDiv = useRef(null);
    const toolbox = `
        <xml>
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
            <block type="math_number"></block>
            <block type="text"></block>
        </xml>
    `;

    useEffect(() => {
        Blockly.inject(blocklyDiv.current, { toolbox });
    }, []);

    return <div ref={blocklyDiv} style={{ height: '480px', width: '600px' }}></div>;
};

export default BlocklyComponent;
