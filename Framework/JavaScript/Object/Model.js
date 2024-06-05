import { Object } from "../Core/Object.js";

export class Model extends Object {
    constructor(modelSrc, textureSrc = "null", spriteName = "null") {
        super(spriteName);

        this.model = null;
        this.meshes = null;
        this.meshCount = 0;

        this.texture = null;

        this.modelSrc = modelSrc;
        this.textureSrc = textureSrc;

    }

    async LoadResource() {
        super.LoadResource();

        await assimpjs().then((ajs) => {
            let files = [
                this.modelSrc,
            ];
            if(this.textureSrc != "null"){
                files.push(this.textureSrc);
            }

            Promise.all(files.map((file) => fetch(file))).then((responses) => {
                return Promise.all(responses.map((res) => res.arrayBuffer()));
            }).then((arrayBuffers) => {
                let fileList = new ajs.FileList();
                for (let i = 0; i < files.length; i++) {
                    fileList.AddFile(files[i], new Uint8Array(arrayBuffers[i]));
                }
                let result = ajs.ConvertFileList(fileList, "assjson");

                if (!result.IsSuccess() || result.FileCount() == 0) {
                    console.log(result.GetErrorCode());
                    return;
                }

                let resultFile = result.GetFile(0);
                let jsonContent = new TextDecoder().decode(resultFile.GetContent());

                this.model = JSON.parse(jsonContent);

                this.SetRender();      
                this.isLoaded = true;
            });
        });
    }

    SetRender() {

        console.log(this.model)
    }

    Update(deltaTime) {
        super.Update(deltaTime);
    }

    Render(deltaTime) {
        super.Render(deltaTime);
    }
}