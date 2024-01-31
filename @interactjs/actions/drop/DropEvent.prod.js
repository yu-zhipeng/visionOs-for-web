/* interact.js 1.10.26 | https://raw.github.com/taye/interact.js/main/LICENSE */

import{BaseEvent}from"../../core/BaseEvent.prod.js";import*as arr from"../../utils/arr.prod.js";class DropEvent extends BaseEvent{constructor(t,e,r){super(e._interaction),this.dropzone=void 0,this.dragEvent=void 0,this.relatedTarget=void 0,this.draggable=void 0,this.propagationStopped=!1,this.immediatePropagationStopped=!1;const{element:o,dropzone:i}="dragleave"===r?t.prev:t.cur;this.type=r,this.target=o,this.currentTarget=o,this.dropzone=i,this.dragEvent=e,this.relatedTarget=e.target,this.draggable=e.interactable,this.timeStamp=e.timeStamp}reject(){const{dropState:t}=this._interaction;if("dropactivate"===this.type||this.dropzone&&t.cur.dropzone===this.dropzone&&t.cur.element===this.target)if(t.prev.dropzone=this.dropzone,t.prev.element=this.target,t.rejected=!0,t.events.enter=null,this.stopImmediatePropagation(),"dropactivate"===this.type){const e=t.activeDrops,r=arr.findIndex(e,(t=>{let{dropzone:e,element:r}=t;return e===this.dropzone&&r===this.target}));t.activeDrops.splice(r,1);const o=new DropEvent(t,this.dragEvent,"dropdeactivate");o.dropzone=this.dropzone,o.target=this.target,this.dropzone.fire(o)}else this.dropzone.fire(new DropEvent(t,this.dragEvent,"dragleave"))}preventDefault(){}stopPropagation(){this.propagationStopped=!0}stopImmediatePropagation(){this.immediatePropagationStopped=this.propagationStopped=!0}}export{DropEvent};
//# sourceMappingURL=DropEvent.prod.js.map
