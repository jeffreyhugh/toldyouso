package hooks

import (
	"ganigeorgiev.com/pocketbase/pocketbase/core"
	"ganigeorgiev.com/pocketbase/pocketbase/tools/security"
	"ganigeorgiev.com/pocketbase/pocketbase/tools/types"
)

func AddChecksum(e *core.RecordEnrichEvent) error {
	if e.RequestInfo.HasSuperuserAuth() {
		return e.Next()
	}

	content := e.Record.Get("content").(string)
	e.Record.WithCustomData(true)
	e.Record.Set("sha256", security.SHA256(content))

	now := types.NowDateTime()
	available := e.Record.Get("available").(types.DateTime)

	if available.After(now) {
		e.Record.Hide("content")
	}

	return e.Next()
}
