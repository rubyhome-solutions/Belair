<?php

$clientSources = \ClientSource::model()->findAll(['condition' => 'is_active=1 and id>1', 'order' => 'name']);
foreach ($clientSources as $clientSource) {
    echo "<label style='font-weight: bold;color: darkblue;'><input type='radio' name='api' value='deeplink:{$clientSource->id}'>&nbsp;DeepLink {$clientSource->name}<br></label>";
}