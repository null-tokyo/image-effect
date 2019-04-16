import dat from 'dat.gui'
import conf from './conf'

class Param {
    constructor() {
        this.effect = {
            brightness: { value: 0.0, min: -1.0, max: 1.0 },
            contrust: { value: 0.0, min: -1.0, max: 1.0 },
            saturation: { value: 0.0, min: -1.0, max: 1.0 },
            denoise: { value: 100.0, min: 0.0, max: 100.0 },
            blur: { value: 0.0, min: 0.0, max: 100.0 },
            zoomBlur: { value: 0.0, min: 0.0, max: 1.0 },
            shiftR: { value: 0.0, min: -0.01, max: 0.01 },
            shiftG: { value: 0.0, min: -0.01, max: 0.01 },
            shiftB: { value: 0.0, min: -0.01, max: 0.01 },
        }
        this.brend = {
            MixBrend: { value: 0.001, min: 0.0, max: 0.9999 },
        }
        if (!conf.debugMode) return
        this.init()
    }
    init() {
        this.gui = new dat.GUI()
        this.addGUI(this.effect, 'effect')
        this.addGUI(this.brend, 'brend')
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
