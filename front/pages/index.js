import React, { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostForm from '../containers/PostForm';
import PostCard from '../containers/PostCard';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';

const Home = () => {
	const me = useSelector((state) => state.user.me);
	const { mainPosts, hasMorePost } = useSelector((state) => state.post);
	const dispatch = useDispatch();
	const countRef = useRef([]);

	const onScroll = useCallback(() => {
		// scrollY: 현재 위치
		// clientHeight : 화면 높이
		// scrollHeight: 전체 화면 길이 (scrollY + clientHeight)
		if (
			window.scrollY + document.documentElement.clientHeight >
			document.documentElement.scrollHeight - 50
		) {
			if (hasMorePost) {
				const lastId = mainPosts[mainPosts.length - 1].id;
				if (!countRef.current.includes(lastId)) {
					dispatch({
						type: LOAD_MAIN_POSTS_REQUEST,
						lastId,
					});
					countRef.current.push(lastId);
				}
			}
		}
	}, [mainPosts.length, hasMorePost]);

	useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	}, [mainPosts.length]);

	return (
		<div>
			{me ? <div>로그인 했습니다: {me.nickname}</div> : <div>로그아웃 했습니다.</div>}
			{me && <PostForm />}
			{mainPosts.map((c) => {
				return <PostCard key={`${c.id}: ${c.createdAt}`} post={c} />;
			})}
		</div>
	);
};

// 서버 사이드 랜더링의 핵심
// 프론트엔드 비동기호출은 리덕스 사가를 사용
// 서버쪽에서 데이터 완성 -> 프론트로 전송
Home.getInitialProps = async (context) => {
	context.store.dispatch({
		type: LOAD_MAIN_POSTS_REQUEST,
	});
};

export default Home;
