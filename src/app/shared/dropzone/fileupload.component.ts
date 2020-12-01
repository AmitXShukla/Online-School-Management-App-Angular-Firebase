import { Component, Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BackendService } from '../../services/backend.service';

@Component({
    selector: 'app-fileupload',
    templateUrl: './fileupload.component.html',
    styleUrls: ['./fileupload.component.css']
})
export class FileUploadComponent {
    @Input() fileUrl: string;
    @Input() docId: string;
    task: AngularFireUploadTask;
    percentage: Observable<number>;
    snapshot: Observable<any>;
    downloadURL: Observable<string>;
    isHovering: boolean;
    error: boolean = false;
    errorMessage: string = "";

    constructor(private _storage: AngularFireStorage, private _backendService: BackendService) { }

    toggleHover(event: any) {
        this.isHovering = event;
    }

    startUpload(event: any) {
        const file = event.target.files[0];
        const filePath = this.fileUrl + '/' + event.target.files[0].name + '_' + new Date().getTime();
        const fileRef = this._storage.ref(filePath);
        // const task = this._storage.upload(filePath, file);
        const task = fileRef.put(file);
        // observe percentage changes
        this.percentage = task.percentageChanges();
        // get notified when the download URL is available
        task.snapshotChanges().pipe(
            finalize(() => this.downloadURL = fileRef.getDownloadURL())
        )
            .subscribe((res) => {
                if (res.bytesTransferred == res.totalBytes) {
                    this._backendService.updateFileUpload(this.fileUrl, this.docId, res.ref["fullPath"]);
                }
            });
    }

    isActive(snapshot: any) {
        return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
    }
}