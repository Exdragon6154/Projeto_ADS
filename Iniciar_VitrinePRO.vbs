
Option Explicit

Dim sh, fso, base, backend, cmd, i, http, ok

Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

base = fso.GetParentFolderName(WScript.ScriptFullName)
backend = base & "\backend"

' Primeiro verifica se o servidor ja esta funcionando.
ok = False

If VerificarAPI() Then
    ok = True
Else
    ' Inicia o servidor somente se a API estiver parada.
    If Not fso.FolderExists(backend) Then
        MsgBox "Pasta backend nao encontrada.", vbCritical, "Vitrine Pro"
        WScript.Quit
    End If

    cmd = "cmd /c cd /d """ & backend & """ && if not exist node_modules npm install && node server.js"
    sh.Run cmd, 0, False

    ' Aguarda a API responder.
    For i = 1 To 40
        WScript.Sleep 1000
        If VerificarAPI() Then
            ok = True
            Exit For
        End If
    Next
End If

If ok Then
    sh.Run "http://localhost:3000/", 1, False
Else
    MsgBox "O Vitrine Pro nao iniciou." & vbCrLf & _
           "Verifique o MySQL e o backend.", _
           vbExclamation, "Vitrine Pro"
End If

Function VerificarAPI()
    On Error Resume Next

    Set http = CreateObject("WinHttp.WinHttpRequest.5.1")
    http.SetTimeouts 2000, 2000, 2000, 2000
    http.Open "GET", "http://localhost:3000/api/health", False
    http.Send

    VerificarAPI = (Err.Number = 0 And http.Status = 200)

    Err.Clear
    On Error GoTo 0
End Function
