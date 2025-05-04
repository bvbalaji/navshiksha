"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SettingsSwitches() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    darkMode: false,
    autoSave: true,
  })

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your application preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive notifications about important updates</p>
          </div>
          <Switch
            id="notifications"
            checked={settings.notifications}
            onCheckedChange={() => handleToggle("notifications")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailAlerts">Email Alerts</Label>
            <p className="text-sm text-muted-foreground">Receive email alerts for important events</p>
          </div>
          <Switch id="emailAlerts" checked={settings.emailAlerts} onCheckedChange={() => handleToggle("emailAlerts")} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="darkMode">Dark Mode</Label>
            <p className="text-sm text-muted-foreground">Use dark theme for the application</p>
          </div>
          <Switch id="darkMode" checked={settings.darkMode} onCheckedChange={() => handleToggle("darkMode")} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autoSave">Auto Save</Label>
            <p className="text-sm text-muted-foreground">Automatically save your work</p>
          </div>
          <Switch id="autoSave" checked={settings.autoSave} onCheckedChange={() => handleToggle("autoSave")} />
        </div>
      </CardContent>
    </Card>
  )
}
