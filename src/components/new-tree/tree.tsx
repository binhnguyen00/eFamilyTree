import React from 'react';
import FamilyTree from "@balkangraph/familytree.js";

interface TreeProps {
  nodes: any[];
}
const Tree: React.FC<TreeProps> = React.memo(({ nodes }) => {
  const divRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (divRef.current) {
      const family = new FamilyTree(divRef.current, {
        nodes: nodes,
        nodeBinding: {
          field_0: 'name',
          img_0: 'img',
        },
      });

      return () => {
        if (family) {
          family.destroy();
        }
      };
    }

    return;
  }, [ nodes ]);

  return <div id="tree" ref={divRef}></div>;
});

export default Tree;