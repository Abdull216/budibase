"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unassigned = exports.assigned = exports.deleted = exports.updated = exports.created = void 0;
const events_1 = require("../events");
const types_1 = require("@budibase/types");
function created(role, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            roleId: role._id,
            permissionId: role.permissionId,
            inherits: role.inherits,
        };
        yield (0, events_1.publishEvent)(types_1.Event.ROLE_CREATED, properties, timestamp);
    });
}
exports.created = created;
function updated(role) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            roleId: role._id,
            permissionId: role.permissionId,
            inherits: role.inherits,
        };
        yield (0, events_1.publishEvent)(types_1.Event.ROLE_UPDATED, properties);
    });
}
exports.updated = updated;
function deleted(role) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            roleId: role._id,
            permissionId: role.permissionId,
            inherits: role.inherits,
        };
        yield (0, events_1.publishEvent)(types_1.Event.ROLE_DELETED, properties);
    });
}
exports.deleted = deleted;
function assigned(user, roleId, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            userId: user._id,
            roleId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.ROLE_ASSIGNED, properties, timestamp);
    });
}
exports.assigned = assigned;
function unassigned(user, roleId) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            userId: user._id,
            roleId,
        };
        yield (0, events_1.publishEvent)(types_1.Event.ROLE_UNASSIGNED, properties);
    });
}
exports.unassigned = unassigned;
//# sourceMappingURL=role.js.map