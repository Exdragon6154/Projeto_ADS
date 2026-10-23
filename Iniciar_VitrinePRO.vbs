Option Explicit
Dim sh, fso, base, backend, cmd, i, http, ok
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
base = fso.GetParentFolderName(WScript.ScriptFullName)
backend = base & "\backend"

' Inicia o backend sem abrir uma janela do CMD.
cmd = "cmd /c cd /d """ & backend & """ && if not exist node_modules npm install && node server.js"
sh.Run cmd, 0, False

' Aguarda a API ficar disponível e depois abre a aplicação.
ok = False
For i = 1 To 20
  WScript.Sleep 1000
  On Error Resume Next
  Set http = CreateObject("WinHttp.WinHttpRequest.5.1")
  http.Open "GET", "http://localhost:3000/api/health", False
  http.Send
  If Err.Number = 0 Then
    If http.Status = 200 Then ok = True
  End If
  Err.Clear
  On Error GoTo 0
  If ok Then Exit For
Next

sh.Run "http://localhost:3000/", 1, False
