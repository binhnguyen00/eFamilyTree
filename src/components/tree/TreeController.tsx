import React from "react";
import { renderToString as reactDomToString } from 'react-dom/server';
import { t } from "i18next";
import { Box, useSnackbar } from "zmp-ui";

import { CommonUtils, ZmpSDK } from "utils";
import { useAppContext, useNotification } from "hooks";
import { SizedBox, CommonIcon } from "components";
import { FamilyTreeApi } from "api";
import { ServerResponse } from "server";

interface TreeControllerProps {
  rootId: string;
  onZoomToRoot: (root: HTMLElement, scale?: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  html2export: {
    content: React.ReactNode;
    width: number;
    height: number;
  };
  onReset?: () => void;
}

export function TreeController(props: TreeControllerProps) {
  const { userInfo, serverBaseUrl } = useAppContext();
  const { loadingToast } = useNotification();
  const { rootId, onZoomToRoot, onZoomIn, onZoomOut, onReset, html2export } = props;

  const exportSVG = () => {
    const content = reactDomToString(html2export.content);
    const width = html2export.width + 120;
    const height = html2export.height + 120;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <style>
          #tree-canvas {
            position: relative !important;
            transform: unset !important;
            left: unset !important;
            top: unset !important;
          }
          .svg-node {
            width: 100px !important;
            height: 150px !important;
          }
        </style>
        <foreignObject class="" width="${width}" height="${height}">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${content}
          </div>
        </foreignObject>
      </svg>
    `;

    const svg2Base64Success = (base64: string) => {
      const loadingContent = (
        <div>
          <p> {t("preparing_data")} </p>
          <p> {t("please_wait")} </p>
        </div>
      )
      loadingToast(
        loadingContent, 
        (onSuccess, onFail) => {
          const success = (result: ServerResponse) => {
            if (result.status === "success") {
              let data = result.data as { id: number; path: string; };
              ZmpSDK.downloadFile(`${serverBaseUrl}/${data.path}`);
              onSuccess(t("download_success"));
            } else {
              onFail(t("download_failed"));
            };
          }
          FamilyTreeApi.exportSVG(userInfo.id, userInfo.clanId, base64, success);
        }
      );
    }

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    CommonUtils.objToBase64(blob, svg2Base64Success)
  }

  const findRoot = () => {
    const root = document.querySelector<HTMLDivElement>(`#node-${rootId}`);
    if (root) onZoomToRoot(root);
  }

  const style = {
    color: "var(--primary-color)",
    zIndex: 9999,
    position: "fixed",
    right: 5,
  } as React.CSSProperties;

  return (
    <Box
      flex flexDirection='column' alignItems='flex-end'
      style={style}
    >
      <SizedBox 
        className='bg-secondary mb-1 p-1 button border-primary'
        width={"fit-content"} height={"fit-content"}
        onClick={findRoot}
        children={<CommonIcon.Home size={32}/>}
      />

      <SizedBox 
        className='bg-secondary mb-1 p-1 button border-primary'
        width={"fit-content"} height={"fit-content"}
        onClick={() => onZoomIn()}
        children={<CommonIcon.ZoomIn size={32}/>}
      />

      <SizedBox 
        className='bg-secondary mb-1 p-1 button border-primary'
        width={"fit-content"} height={"fit-content"}
        onClick={() => onZoomOut()}
        children={<CommonIcon.ZoomOut size={32}/>}
      />

      <SizedBox
        className='bg-secondary mb-1 p-1 button border-primary'
        width={"fit-content"} height={"fit-content"}
        onClick={exportSVG}
        children={<CommonIcon.SVG size={32}/>}
      />

      {onReset && (
        <SizedBox 
          className='bg-secondary p-1 button border-primary'
          width={"fit-content"} height={"fit-content"} border
          onClick={() => onReset()}
          children={<CommonIcon.Reset size={32}/>}
        />
      )}
    </Box>
  )
}