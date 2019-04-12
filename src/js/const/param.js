import dat from 'dat-gui'
import conf from './conf'

class Param {
    constructor() {
        this.cube = {
            FogStart: { value: 0.5, min: 0.01, max: 15.0 },
            FogEnd: { value: 12.01, min: 0.01, max: 15.0 },
            MixBrend: { value: 0.001, min: 0.0, max: 0.9999 },
        }
        if (!conf.debugMode) return
        this.init()
    }
    init() {
        this.gui = new dat.GUI()
        this.addGUI(this.cube, 'effect')
        document.querySelector('.dg').style.zIndex = 9999
    }
    addGUI(obj, folderName) {
        const folder = this.gui.addFolder(folderName)
        for (let key in obj) {
            let val = obj[key]
            let g
            if (/Color/.test(key)) {
                g = folder.addColor(val, 'value').name(key)
            } else {
                if (val.list) {
                    g = folder.add(val, 'value', val.list).name(key)
                } else {
                    g = folder
                        .add(val, 'value', val.min, val.max, 0.001)
                        .name(key)
                }
            }
            val.gui = g
        }
    }
}

export default new Param()
