import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { TreeConfig } from './Config';

const { Top, Bottom, Left, Right } = Position;

export default React.memo(function Node({ data }: any) {
  const { isSpouse, isSibling, label, direction } = data;

  const isTreeHorizontal = direction === 'LR';

  const getTargetPosition = () => {
    if (isSpouse) {
      return isTreeHorizontal ? Top : Left;
    } else if (isSibling) {
      return isTreeHorizontal ? Bottom : Right;
    }
    return isTreeHorizontal ? Left : Top;
  };

  const isRootNode = data?.isRoot;
  const hasChildren = !!data?.children?.length;
  const hasSiblings = !!data?.siblings?.length;
  const hasSpouses = !!data?.spouses?.length;

  /**
   * @HtmlTag <Handle/> are the dots appear on the edge of the Node
   */
  return (
    <div 
      className="border-primary text-center rounded"
      style={{
        width: TreeConfig.nodeWidth,
        height: TreeConfig.nodeHeight
      }}
    >
      {/* For children */}
      {hasChildren && (
        <Handle
          type="source"
          position={isTreeHorizontal ? Right : Bottom}
          id={isTreeHorizontal ? Right : Bottom}
        />
      )}

      {/* For spouses */}
      {hasSpouses && (
        <Handle
          type="source"
          position={isTreeHorizontal ? Bottom : Right}
          id={isTreeHorizontal ? Bottom : Right}
        />
      )}

      {/* For siblings */}
      {hasSiblings && (
        <Handle
          type="source"
          position={isTreeHorizontal ? Top : Left}
          id={isTreeHorizontal ? Top : Left}
        />
      )}

      {/* Target Handle */}
      {!isRootNode && (
        <Handle
          type={'target'}
          position={getTargetPosition()}
          id={getTargetPosition()}
        />
      )}
      <div>{label}</div>
    </div>
  );
});