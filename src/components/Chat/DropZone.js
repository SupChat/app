import React, { Fragment, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import FileDialog from './FileDialog'
import Dialog from '@material-ui/core/Dialog'
import * as uuid from 'uuid'
import { useSelector } from 'react-redux'
import { selectActiveConversation } from '../../actions/conversations'
import { db, storage } from '../../firebase'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%',
        background:'red',
        position:'absolute',
        top:0,
        left:0,
        // 'pointer-events': 'none',
    }
})

const DropZone = ({ onSendMessage,isDragOn }) => {
    const activeConversation = useSelector(selectActiveConversation)
    const currentUser = useSelector(store => store.auth.user)
    const onDrop = useCallback((acceptedFiles) => {
        console.log(acceptedFiles)
        setFile(acceptedFiles[0])
    }, [])

    const [file, setFile] = React.useState(null)
    const classes = useStyles()

    function toggleFile(file) {
        setFile(file)
    }

    async function sendMessage(text) {
        onSendMessage()
        setFile(null)
        const msgId = uuid()

        const messageRef = db
            .collection('conversations')
            .doc(activeConversation.id)
            .collection('messages')
            .doc(msgId)

        await messageRef.set({
            id: msgId,
            text,
            ...(file ? { file: 'pending' } : {}),
            from: currentUser.uid,
            date: new Date(),
        })

        if (file) {
            const fileRef = await storage.ref(`conversations/${activeConversation.id}/${msgId}`).put(file).then((snapshot) => snapshot.ref.getDownloadURL())
            await messageRef.set({ file: fileRef }, { merge: true })
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    return (
        isDragOn &&
        <Fragment>
            <div className={classes.root} {...getRootProps({
                onClick: (e) => e.stopPropagation()
            })}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop some files here</p>

                }
            </div>
            <Dialog
                open={Boolean(file)}
                onClose={() => toggleFile(null)}>
                <FileDialog
                    file={file}
                    handleClose={() => toggleFile(null)}
                    onDone={sendMessage} />
            </Dialog>
        </Fragment>

    )
}


export default DropZone

