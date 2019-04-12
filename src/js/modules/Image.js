import * as THREE from 'three'

import windowResize from '../util/windowResize'
import vert from '../../glsl/modules/image.vert'
import frag from '../../glsl/modules/image.frag'
import param from '../const/param'
import { TweenLite } from 'gsap'

class Image {
    constructor(webgl) {
        this.webgl = webgl
        this.init()
    }
    init() {
        this.width = this.webgl.width
        this.height = this.webgl.height
        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(
            70,
            this.width / this.height,
            0.001,
            10000
        )
        let cameraZ = this.height / 2 / Math.tan((70 * Math.PI) / 180 / 2)
        this.camera.position.set(0, 0, cameraZ)
        this.camera.lookAt(this.scene.position)

        this.scene.add(this.camera)

        this.light = new THREE.DirectionalLight(0xffffff, 1)

        this.renderTargetParameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
        }

        this.fbo = new THREE.WebGLRenderTarget(
            this.width,
            this.height,
            this.renderTargetParameters
        )
        this.fbo.texture.format = THREE.RGBAFormat

        this.createImage()
    }
    createImage() {
        this.geometry = new THREE.PlaneBufferGeometry(
            this.width,
            this.height,
            1,
            1
        )

        this.uniforms = {
            uResolution: {
                type: 'v2',
                value: {
                    x: this.width,
                    y: this.height,
                },
            },
            uImageResolution: {
                type: 'v2',
                value: {
                    x: 4460,
                    y: 2974,
                },
            },
            uTime: { type: 'f', value: 0 },
            uDelta: { type: 'f', value: 0 },
            uBrightness: { type: 'f', value: param.effect.brightness.value },
            uContrast: { type: 'f', value: param.effect.contrust.value },
            uSaturation: { type: 'f', value: param.effect.saturation.value },
            uBlur: { type: 'f', value: param.effect.blur.value },
            uTex: {
                type: 't',
                value: new THREE.TextureLoader().load('images/image.jpg'),
            },
        }
        param.effect.brightness.gui.onChange(val => {
            this.uniforms.uBrightness.value = val
        })
        param.effect.contrust.gui.onChange(val => {
            this.uniforms.uContrast.value = val
        })
        param.effect.saturation.gui.onChange(val => {
            this.uniforms.uSaturation.value = val
        })
        param.effect.blur.gui.onChange(val => {
            this.uniforms.uBlur.value = val
        })

        this.material = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: this.uniforms,
            side: THREE.DoubleSide,
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }
    updateUniforms(time, delta) {
        this.uniforms.uTime.value = time
        this.uniforms.uDelta.value = delta
    }
    render(time, delta) {
        this.webgl.renderer.setRenderTarget(this.fbo)

        this.updateUniforms(time, delta)

        this.webgl.renderer.render(this.scene, this.camera, this.fbo)
    }
    onResize() {
        this.width = this.webgl.width
        this.height = this.webgl.height
        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()

        this.uniforms.uResolution.value = {
            x: this.width,
            y: this.height,
        }
    }
    start() {
        TweenLite.set(this.uniforms.uBlur, {
            value: 14,
        })
        TweenLite.set(this.uniforms.uSaturation, {
            value: -1,
        })
        TweenLite.set(this.uniforms.uBrightness, {
            value: 1,
        })

        TweenLite.to(this.uniforms.uBlur, 1.8, {
            value: 0,
        })
        TweenLite.to(this.uniforms.uSaturation, 1.8, {
            value: 0,
        })
        TweenLite.to(this.uniforms.uBrightness, 1.0, {
            value: 0,
        })
    }
}

export default Image
