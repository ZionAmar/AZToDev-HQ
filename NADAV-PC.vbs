Set sh = CreateObject("Wscript.Shell")
sh.CurrentDirectory = "C:\Users\amazi\Desktop\my_company"
sh.Run "node hq\nadav-pc-worker.mjs", 0, False
