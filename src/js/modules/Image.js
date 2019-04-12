import * as THREE from 'three'

import vert from '../../glsl/modules/image.vert'
import frag from '../../glsl/modules/image.frag'
import param from '../const/param'

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
            0.01,
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
            1
        )

        this.uniforms = {
            uTime: { type: 'f', value: 0 },
            uDelta: { type: 'f', value: 0 },
            uTex: {
                type: 't',
                value: new THREE.TextureLoader().load('images/image.jpg'),
            },
        }

        this.material = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: this.uniforms,
            flatShading: true,
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
}

export default Image
