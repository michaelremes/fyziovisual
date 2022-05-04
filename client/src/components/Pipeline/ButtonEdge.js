import React, { useState } from 'react';
import {
  getBezierPath,
  getEdgeCenter,
  getMarkerEnd,

} from 'react-flow-renderer';

import { Button, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const foreignObjectSize = 40;




export default function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  arrowHeadType,
  markerEndId,
}) {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const [display, setDisplay] = useState("delete-btn-hidden");

  const onDeleteClick = () => {
    data.onElemRemove(id);
  };

  const showButton = e => {
    e.preventDefault();
    setDisplay("delete-btn-visible");
  };

  const hideButton = e => {
    e.preventDefault();
    setDisplay("delete-btn-hidden");
  };

  return (
    <>
  
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{ strokeWidth: 10, stroke: '#ffff', }}
        onMouseEnter={e => showButton(e)}
        onMouseLeave={e => hideButton(e)}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
        onMouseEnter={e => showButton(e)}
        onMouseLeave={e => hideButton(e)}
      >
          <Tooltip title="Odstanit vazbu">
            <Button
              className={display}
              shape='circle'
              icon={<DeleteOutlined />}
              type='danger'

              label='Odstranit'
              onClick={() => onDeleteClick()}

            />
          </Tooltip>
      </foreignObject>
    </>
  );
}
