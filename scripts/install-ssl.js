//@url('/${scriptName}')

var action = getParam("action", "install"),
    token  = getParam("token"),
    isTask = getParam("task"),
    baseUrl = "${baseUrl}";

function run() {
    var SSLManager = use("scripts/ssl-manager.js", {
        session       : session,
        isTask        : isTask,
        baseUrl       : baseUrl,

        token         : "${token}",
        email         : "${email}",
        baseDir       : "${baseDir}",
        scriptName    : "${scriptName}",
        envName       : "${envName}",
        envDomain     : "${envDomain}",
        envAppid      : "${envAppid}",
        nodeId        : "${nodeId}",
        nodeIp        : "${nodeIp}",
        nodeGroup     : "${nodeGroup}",
        customDomains : "${customDomains}",
        cronTime      : "${cronTime}",
        deployHook    : "${deployHook}",
        undeployHook  : "${undeployHook}",
        test          : "${test}"
    });

    var resp = SSLManager.auth(token);

    if (resp.result === 0) {
        resp = SSLManager.invoke(action);
    }

    jelastic.local.ReturnResult(resp);
}

function use(script, config) {
    var Transport = com.hivext.api.core.utils.Transport,
        body = new Transport().get(baseUrl + "/" + script + "?_r=" + Math.random());

    return new (new Function("return " + body)())(config);
}

try {
    run();
} catch (ex) {
    var resp = {
        result : com.hivext.api.Response.ERROR_UNKNOWN,
        error: "Error: " + toJSON(ex)
    };

    if (jelastic.marketplace && jelastic.marketplace.console) {
        jelastic.marketplace.console.WriteLog(appid, signature, "ERROR: " + resp);
    }

    jelastic.local.ReturnResult(resp);
}
