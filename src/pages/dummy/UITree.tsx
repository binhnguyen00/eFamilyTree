import React from "react";
import { t } from "i18next";

import { Header, TreeConfig, TreeNode } from "components";
import Tree from "../../components/tree-new/Tree";

import average from "pages/family-tree/sample/average.json";

export function UIDummyTree() {
  const [ nodes, setNodes ] = React.useState<any[]>(average);
  const [ rootId, setRootId ] = React.useState(nodes[0].id);

  return (
    <>
      <Header title={t("tree")}/>

      <Tree
        nodes={nodes as any}
        rootId={rootId}
        nodeWidth={TreeConfig.nodeWidth}
          nodeHeight={TreeConfig.nodeHeight}
          searchFields={["id", "name"]}
          searchDisplayField="name"
          renderNode={(node: any) => (
            <TreeNode
              key={node.id}
              node={node}
              displayField={"id"}
              isRoot={node.id === rootId}
              onSelectNode={(id: string) => {
                console.log("selected", id);
              }}
            />
          )}
      />
    </>
  )
}