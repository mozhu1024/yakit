import React, {memo, useEffect, useMemo, useRef} from "react"
import {useMemoizedFn, useSize} from "ahooks"
import {ModifyPluginCallback, PluginEditor, PluginEditorRefProps} from "../pluginEditor/PluginEditor"
import {YakitDrawer} from "@/components/yakitUI/YakitDrawer/YakitDrawer"
import {YakScript} from "@/pages/invoker/schema"
import {YakitButton} from "@/components/yakitUI/YakitButton/YakitButton"
import {OutlineXIcon} from "@/assets/icon/outline"

import classNames from "classnames"
import styles from "./ModifyYakitPlugin.module.scss"

interface ModifyYakitPluginProps {
    getContainer?: HTMLElement
    plugin: YakScript
    visible: boolean
    onCallback: (isSuccess: boolean, data?: ModifyPluginCallback) => void
}

export const ModifyYakitPlugin: React.FC<ModifyYakitPluginProps> = memo((props) => {
    const {getContainer, plugin, visible, onCallback} = props

    const getContainerSize = useSize(getContainer)
    // 抽屉展示高度
    const showHeight = useMemo(() => {
        return getContainerSize?.height || 400
    }, [getContainerSize])

    const editorRef = useRef<PluginEditorRefProps>(null)
    useEffect(() => {
        if (visible && plugin) {
            if (editorRef.current)
                editorRef.current.setEditPlugin({
                    id: Number(plugin.Id || 0) || 0,
                    name: plugin.ScriptName,
                    uuid: plugin.UUID || ""
                })
        }
    }, [visible, plugin])

    // 关闭
    const onCancel = useMemoizedFn(() => {
        onCallback(false)
    })
    const onModifyCallback = useMemoizedFn((data: ModifyPluginCallback) => {
        onCallback(true, data)
    })

    return (
        <>
            <YakitDrawer
                getContainer={getContainer}
                placement='bottom'
                mask={false}
                closable={false}
                keyboard={false}
                height={showHeight}
                visible={visible}
                className={classNames(styles["plugin-debug-drawer"])}
            >
                {visible && (
                    <PluginEditor
                        ref={editorRef}
                        title='编辑插件'
                        headerExtra={<YakitButton type='text2' icon={<OutlineXIcon />} onClick={onCancel} />}
                        onEditCancel={onModifyCallback}
                    />
                )}
            </YakitDrawer>
        </>
    )
})
