<?php

    $pageName = "";

    if (isset($_GET["page"])) {
        $pageName = $_GET["p"];
    }

    if (!empty($_GET["page"])) {
        $data = array();

        // Depending on the page, set the appropriate data
    } else { 
        echo load_page("main-menu", array());
    }


    function load_page($pageName, $data) {
        $main_page_contents = file_get_contents(__DIR__ . "/views/layout/layout.html");
        $emb_page_contents = file_get_contents(__DIR__ . "/views/pages/" . $pageName . ".html");

        // If there is data
        if (!empty($data)) {
            foreach ($data as $key => $value) {
                $emb_page_contents = str_replace("!" . $key . "!", $value, $emb_page_contents);
            }
        }

        $main_page_contents = str_replace("!BODY!", $emb_page_contents, $main_page_contents);

        return $main_page_contents;
    }

?>
