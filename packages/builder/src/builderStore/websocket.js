import { createWebsocket } from "@budibase/frontend-core"
import {
  userStore,
  store,
  deploymentStore,
  automationStore,
} from "builderStore"
import { datasources, tables } from "stores/backend"
import { get } from "svelte/store"
import { auth, apps } from "stores/portal"
import { SocketEvent, BuilderSocketEvent, helpers } from "@budibase/shared-core"
import { notifications } from "@budibase/bbui"

export const createBuilderWebsocket = appId => {
  const socket = createWebsocket("/socket/builder")

  // Built-in events
  socket.on("connect", () => {
    socket.emit(BuilderSocketEvent.SelectApp, { appId }, ({ users }) => {
      userStore.actions.init(users)
    })
  })
  socket.on("connect_error", err => {
    console.error("Failed to connect to builder websocket:", err.message)
  })
  socket.on("disconnect", () => {
    userStore.actions.reset()
  })

  // User events
  socket.onOther(SocketEvent.UserUpdate, ({ user }) => {
    userStore.actions.updateUser(user)
  })
  socket.onOther(SocketEvent.UserDisconnect, ({ sessionId }) => {
    userStore.actions.removeUser(sessionId)
  })
  socket.onOther(BuilderSocketEvent.LockTransfer, ({ userId }) => {
    if (userId === get(auth)?.user?._id) {
      store.update(state => ({
        ...state,
        hasLock: true,
      }))
    }
  })

  // Data section events
  socket.onOther(BuilderSocketEvent.TableChange, ({ id, table }) => {
    tables.replaceTable(id, table)
  })
  socket.onOther(BuilderSocketEvent.DatasourceChange, ({ id, datasource }) => {
    datasources.replaceDatasource(id, datasource)
  })

  // Design section events
  socket.onOther(BuilderSocketEvent.ScreenChange, ({ id, screen }) => {
    store.actions.screens.replace(id, screen)
  })
  socket.onOther(BuilderSocketEvent.AppMetadataChange, ({ metadata }) => {
    store.actions.metadata.replace(metadata)
  })
  socket.onOther(
    BuilderSocketEvent.AppPublishChange,
    async ({ user, published }) => {
      await apps.load()
      if (published) {
        await deploymentStore.actions.load()
      }
      const verb = published ? "published" : "unpublished"
      notifications.success(`${helpers.getUserLabel(user)} ${verb} this app`)
    }
  )

  // Automations
  socket.onOther(BuilderSocketEvent.AutomationChange, ({ id, automation }) => {
    automationStore.actions.replace(id, automation)
  })

  return socket
}
