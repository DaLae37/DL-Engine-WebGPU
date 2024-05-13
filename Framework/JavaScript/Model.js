import { Object } from "./Object.js";

export class Model extends Object {
    constructor(src, spriteName = "null") {
        super(spriteName);

        this.model = null;
        this.meshes = null;
        this.meshCount = 0;

        this.texture = null;

        this.src = src;
    }

    async LoadResource() {
        super.LoadResource();

        await assimpjs().then((ajs) => {
            let files = [
                this.src,
            ];
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
        this.meshes = this.model.meshes;
        this.meshCount = this.meshes.length;
        console.log(this.model)
    }

    Update(deltaTime) {
        super.Update(deltaTime);
    }

    Render(deltaTime) {
        super.Render(deltaTime);
    }
}