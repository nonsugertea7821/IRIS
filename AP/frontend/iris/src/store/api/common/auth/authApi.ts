import { axiosHelper } from "../../../axios/axiosHelper";
import { IrisUrl } from "../../irisUrl";
import { ChallengeResponse, LoginResponse, LogoutResponse } from "./data";

/**
 * クライアント識別子を取得する。
 * @returns クライアント識別子
 */
export async function getUserId(userName: string): Promise<string> {
    return await axiosHelper.get(
        IrisUrl.IRIS_API_GET_AUTH_GET_USER_ID,
        { params: { userName } }
    );
}

/**
 * チャレンジを取得する。
 * @param userId クライアント識別子
 * @returns チャレンジ
 */
export async function challenge(userId: string): Promise<ChallengeResponse> {
    return await axiosHelper.get<ChallengeResponse>(
        IrisUrl.IRIS_API_GET_AUTH_CHALLENGE,
        { params: { userId } }
    );
}

/**
 * ログイン要求を行う。
 * @param userId クライアント識別子
 * @param passwordHash ハッシュ化パスワード
 * @returns ログイン結果
 */
export async function loginRequest(userId: string, passwordHash: string): Promise<LoginResponse> {
    return await axiosHelper.post<LoginResponse>(
        IrisUrl.IRIS_API_POST_AUTH_LOGIN,
        { userId, passwordHash }
    );
}

/**
 * ログアウト要求を行う。
 * @returns ログアウト結果
 */
export async function logoutRequest(): Promise<LogoutResponse> {
    return await axiosHelper.post<LogoutResponse>(
        IrisUrl.IRIS_API_POST_LOGOUT
    )
}