import React from "react";
import { t } from "i18next";
import { Header, Tree } from "components"

const nodes = [
  { id: 1, pids: [2], name: 'Amber McKenzie', gender: 'female', img: 'https://cdn.balkan.app/shared/2.jpg'  },
  { id: 2, pids: [1], name: 'Ava Field', gender: 'male', img: 'https://cdn.balkan.app/shared/m30/5.jpg' },
  { id: 3, mid: 1, fid: 2, name: 'Peter Stevens', gender: 'male', img: 'https://cdn.balkan.app/shared/m10/2.jpg' },
  { id: 4, mid: 1, fid: 2, name: 'Savin Stevens', gender: 'male', img: 'https://cdn.balkan.app/shared/m10/1.jpg'  },
  { id: 5, mid: 1, fid: 2, name: 'Emma Stevens', gender: 'female', img: 'https://cdn.balkan.app/shared/w10/3.jpg' }
]

export default function UIDummyTreeNew() {
  return (
    <div className="tree-container">
      <Header title={t("family_tree")} />

      <Tree nodes={nodes}/>
    </div>
  )
}