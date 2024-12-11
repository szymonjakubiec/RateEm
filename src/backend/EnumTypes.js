/**
 * @enum
 * @type {Readonly<{Undefined: symbol, Add: symbol, Update: symbol}>}
 */
const RatingPopupTypes = Object.freeze({
  Undefined: Symbol("Undefined"),
  Add: Symbol("Add"),
  Update: Symbol("Update")
});

/**
 * @enum
 * @type {Readonly<{Undefined: symbol, Deletion: symbol, Update: symbol}>}
 */
const ConfirmPopupTypes = Object.freeze({
  Undefined: Symbol("Undefined"),
  Update: Symbol("Update"),
  Deletion: Symbol("Deletion")
});

module.exports={RatingPopupTypes, ConfirmPopupTypes}
