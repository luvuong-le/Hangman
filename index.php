<?php

    $pageNameURL = str_replace("/?", "", $_SERVER['REQUEST_URI']);
    $pageName = str_replace(".html", "", $pageNameURL);

    // if (isset($_GET["page"])) {
    //     $pageName = $_GET["page"];
    // }

    if ($pageName != "/") {
        $data = array();

        switch($pageName) {
            case "main-menu": 
                $data = [
                    "TITLE" => "Hangman | Main Menu"
                ];
                break;
            case "mode-single":
                $data = [
                    "TITLE" => "Hangman | Single Player"
                ];
                break;
            case "mode-single-category":
                $data = [
                    "TITLE" => "Hangman | Cateogories"
                ];
                break;
            case "mode-twoplayers-setup":
                $data = [
                    "TITLE" => "Hangman | Two Players Setup"
                ];
                break;
            case "mode-twoplayers-setup-2":
                $data = [
                    "TITLE" => "Hangman | Two Players Setup Phase 2"
                ];
                break;
            case "mode-twoplayers":
                $data = [
                    "TITLE" => "Hangman | Two Player Game"
                ];
                break;
        }

        echo load_page($pageName, $data);

        // Depending on the page, set the appropriate data
    } else { 
        $data = array(
            "TITLE" => "Hangman | Main Menu",
        );
        echo load_page("main-menu", $data);
    }


    function load_page($pageName, $data) {
        $main_page_contents = file_get_contents(__DIR__ . "/views/layout/layout.html");
        $emb_page_contents = file_get_contents(__DIR__ . "/views/pages/" . $pageName . ".html");

        // If there is data, skip
        if (!empty($data)) {
            foreach ($data as $key => $value) {
                $emb_page_contents = str_replace("!" . $key . "!", $value, $emb_page_contents);
            }
        }
        $main_page_contents = str_replace("!TITLE!", $data["TITLE"], $main_page_contents);
        $main_page_contents = str_replace("!BODY!", $emb_page_contents, $main_page_contents);

        return $main_page_contents;
    }

?>
